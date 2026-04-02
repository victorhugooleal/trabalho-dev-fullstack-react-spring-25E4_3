pipeline {
    agent any

    environment {
        // Configure esta credencial no Jenkins: Manage Jenkins > Credentials
        // ID: 'dockerhub-credentials', tipo: Username with password
        DOCKER_HUB_USER        = "victorhleal"
        IMAGE_BACKEND          = "victorhleal/cars-backend"
        IMAGE_FRONTEND         = "victorhleal/cars-frontend"
        K8S_NAMESPACE          = "cars-devops"
        IMAGE_TAG              = "${env.BUILD_NUMBER ?: 'latest'}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        // ─────────────────────────────────────────────
        // STAGE 1: Checkout
        // ─────────────────────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositório...'
                checkout scm
                sh 'git log --oneline -5'
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 2: Build do backend com Maven
        // ─────────────────────────────────────────────
        stage('Build Backend') {
            steps {
                echo '☕ Compilando o backend Spring Boot...'
                dir('backend') {
                    sh 'mvn clean package -DskipTests -q'
                    sh 'ls -lh target/*.jar'
                }
            }
            post {
                success { echo '✅ Build do backend concluído!' }
                failure { echo '❌ Falha no build do backend.' }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 3: Testes unitários
        // ─────────────────────────────────────────────
        stage('Testes Unitários') {
            steps {
                echo '🧪 Executando testes do backend...'
                dir('backend') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    // Publicar resultados de teste no Jenkins
                    junit allowEmptyResults: true,
                          testResults: 'backend/target/surefire-reports/*.xml'
                }
                success { echo '✅ Todos os testes passaram!' }
                failure { echo '❌ Testes falharam. Verifique os logs.' }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 4: Build das imagens Docker
        // ─────────────────────────────────────────────
        stage('Build Docker Images') {
            steps {
                echo '🐳 Construindo imagens Docker...'
                sh """
                    docker build \
                        -t ${IMAGE_BACKEND}:${IMAGE_TAG} \
                        -t ${IMAGE_BACKEND}:latest \
                        ./backend
                """
                sh """
                    docker build \
                        -t ${IMAGE_FRONTEND}:${IMAGE_TAG} \
                        -t ${IMAGE_FRONTEND}:latest \
                        ./frontend
                """
                sh "docker images | grep -E '${DOCKER_HUB_USER}'"
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 5: Push para Docker Hub
        // ─────────────────────────────────────────────
        stage('Push para Docker Hub') {
            steps {
                echo '📤 Publicando imagens no Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

                    // Push backend
                    sh "docker push ${IMAGE_BACKEND}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_BACKEND}:latest"

                    // Push frontend
                    sh "docker push ${IMAGE_FRONTEND}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_FRONTEND}:latest"

                    sh 'docker logout'
                }
            }
            post {
                success { echo '✅ Imagens publicadas no Docker Hub!' }
                failure { echo '❌ Falha ao publicar no Docker Hub.' }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 6: Deploy no Kubernetes
        // ─────────────────────────────────────────────
        stage('Deploy no Kubernetes') {
            steps {
                echo '☸️ Realizando deploy no Kubernetes...'

                // Aplica namespace e recursos base
                sh "kubectl apply -f k8s/"

                // Aplica stack de monitoramento
                sh "kubectl apply -f k8s/monitoring/"

                // Força restart dos deployments para pegar a nova imagem
                sh "kubectl rollout restart deployment/cars-backend  -n ${K8S_NAMESPACE}"
                sh "kubectl rollout restart deployment/cars-frontend -n ${K8S_NAMESPACE}"

                // Aguarda rollout concluir (timeout 3 min)
                sh "kubectl rollout status deployment/cars-backend  -n ${K8S_NAMESPACE} --timeout=180s"
                sh "kubectl rollout status deployment/cars-frontend -n ${K8S_NAMESPACE} --timeout=180s"
            }
            post {
                success { echo '✅ Deploy no Kubernetes concluído!' }
                failure {
                    echo '❌ Falha no deploy. Exibindo status dos pods...'
                    sh "kubectl get pods -n ${K8S_NAMESPACE} || true"
                    sh "kubectl describe deployment cars-backend -n ${K8S_NAMESPACE} || true"
                }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 7: Smoke Test pós-deploy
        // ─────────────────────────────────────────────
        stage('Smoke Test') {
            steps {
                echo '🔍 Verificando saúde da aplicação...'
                script {
                    def nodeIp = sh(
                        script: "kubectl get nodes -o jsonpath='{.items[0].status.addresses[0].address}'",
                        returnStdout: true
                    ).trim()

                    // Testa o health endpoint do backend
                    sh "curl -f --retry 5 --retry-delay 5 http://${nodeIp}:30080/actuator/health"
                    echo "✅ Backend respondendo em http://${nodeIp}:30080"

                    // Testa o frontend
                    sh "curl -f --retry 3 --retry-delay 3 http://${nodeIp}:30030"
                    echo "✅ Frontend respondendo em http://${nodeIp}:30030"
                }
            }
        }

        // ─────────────────────────────────────────────
        // STAGE 8: Status final dos pods
        // ─────────────────────────────────────────────
        stage('Status dos Pods') {
            steps {
                echo '📊 Estado atual do cluster:'
                sh "kubectl get pods      -n ${K8S_NAMESPACE} -o wide"
                sh "kubectl get services  -n ${K8S_NAMESPACE}"
                sh "kubectl get deployments -n ${K8S_NAMESPACE}"
            }
        }
    }

    post {
        always {
            echo '🏁 Pipeline finalizado.'
            // Limpeza de imagens locais para economizar espaço
            sh "docker rmi ${IMAGE_BACKEND}:${IMAGE_TAG} || true"
            sh "docker rmi ${IMAGE_FRONTEND}:${IMAGE_TAG} || true"
        }
        success {
            echo '''
            ╔══════════════════════════════════════╗
            ║  🎉 DEPLOY REALIZADO COM SUCESSO!    ║
            ╚══════════════════════════════════════╝
            '''
        }
        failure {
            echo '''
            ╔══════════════════════════════════════╗
            ║  💥 PIPELINE FALHOU - VERIFIQUE LOGS ║
            ╚══════════════════════════════════════╝
            '''
        }
    }
}
