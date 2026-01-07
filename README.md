# Projeto Fullstack: Spring Boot (backend) + React (frontend)

Este repositório contém a base para o trabalho de pós-graduação: um backend em Spring Boot e um frontend em React. O objetivo é implementar e integrar funcionalidades CRUD, autenticação JWT, exportação de dados e empacotar a aplicação com Docker para entrega.

Pré-requisitos
- Docker e Docker Compose instalados na máquina (testado em Windows com PowerShell).
- Java 17+ (quando executar localmente sem Docker) e Maven (opcional, pois há wrappers).
- Node.js 16+ (quando executar frontend localmente sem Docker).

Como executar (recomendado: com Docker)
1. Na raiz do projeto, construa e suba os containers:

```powershell
docker-compose up --build -d
```

2. Acesse o frontend no navegador (URL e porta serão documentadas assim que o `docker-compose.yml` for adicionado).

Execução local (sem Docker)
- Backend:

```powershell
cd backend
.\mvnw spring-boot:run
```

- Frontend:

```powershell
cd frontend
npm install
npm start
```

Arquivos importantes
- `.gitignore` — Regras para ignorar artefatos de build, dependências e os arquivos Markdown de entrega conforme solicitado.
- `ACOMPANHAMENTO_IMPLEMENTACAO.md` — Arquivo de apoio que conterá o plano de implementação, registros de commits e evidências (prints/logs) para gerar o PDF de entrega.

Próximos passos
- Revisar o backend e implementar endpoints que faltam.
- Inicializar o frontend React e integrar com os endpoints.
- Implementar autenticação JWT e exportação de dados.

Observação
- Os arquivos `ENTREGA.md`, `diretrizes_trabalho.md` e `IMPLEMENTACAO.md` estão no `.gitignore` conforme solicitado para não serem incluídos no commit inicial. Garanta que isto esteja conforme as regras da sua instituição antes de subir o repositório final.
# Sistema de Gerenciamento de Carros

Sistema full-stack desenvolvido com Spring Boot e React para gerenciamento de cadastro de carros, com autenticacao JWT e funcionalidades completas de CRUD.

## Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 3.4.0
- Spring Data JPA
- Spring Security com JWT
- H2 Database (em memoria)
- Maven
- Lombok
- OpenCSV para exportacao

### Frontend
- React 18
- React Router para navegacao
- Axios para chamadas HTTP
- CSS moderno e responsivo

### Infraestrutura
- Docker e Docker Compose
- Containerizacao completa da aplicacao

## Estrutura do Projeto

```
trabalho-dev-fullstack-react-spring-25E4_3/
├── backend/                    # API REST Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/acme/cars/
│   │   │   │   ├── controller/      # Controladores REST
│   │   │   │   ├── model/           # Entidades JPA
│   │   │   │   ├── repository/      # Repositorios
│   │   │   │   ├── service/         # Logica de negocio
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── payload/         # Request/Response payloads
│   │   │   │   └── exception/       # Tratamento de excecoes
│   │   │   └── resources/
│   │   │       ├── application.yaml # Configuracoes
│   │   │       └── data.sql         # Dados iniciais
│   │   └── test/                    # Testes unitarios
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # Aplicacao React
│   ├── public/
│   ├── src/
│   │   ├── components/        # Componentes reutilizaveis
│   │   ├── pages/            # Paginas da aplicacao
│   │   ├── services/         # Servicos de API
│   │   ├── context/          # Context API (Auth)
│   │   └── App.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml         # Orquestracao dos containers
├── README.md                  # Este arquivo
├── IMPLEMENTACAO.md           # Detalhamento das implementacoes
└── ENTREGA.md                 # Documentacao de entrega do projeto
```

## Funcionalidades Implementadas

### Autenticacao e Seguranca
- Login com JWT (JSON Web Token)
- Logout seguro
- Protecao de rotas no frontend e backend
- Token refresh automatico
- Validacao de sessao

### CRUD de Carros
- Listagem paginada de carros
- Busca e filtros (modelo, fabricante, pais)
- Cadastro de novos carros
- Edicao de carros existentes
- Exclusao de carros
- Validacao de dados

### Funcionalidades Extras
- Exportacao de dados em CSV
- Dashboard com estatisticas
- Interface responsiva
- Tratamento de erros consistente
- Feedback visual para o usuario

## Requisitos para Execucao

### Usando Docker (Recomendado)
- Docker 20.10+
- Docker Compose 2.0+

### Execucao Local
- Java 21
- Node.js 18+
- Maven 3.8+

## Como Executar

### Opcao 1: Docker (Mais Facil)

1. Clone o repositorio:
```bash
git clone https://github.com/victorhugooleal/trabalho-dev-fullstack-react-spring-25E4_3.git
cd trabalho-dev-fullstack-react-spring-25E4_3
```

2. Execute com Docker Compose:
```bash
docker-compose up --build
```

3. Acesse as aplicacoes:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Console H2: http://localhost:8080/h2-console

### Opcao 2: Execucao Local

#### Backend:
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend:
```bash
cd frontend
npm install
npm start
```

## Credenciais de Acesso

Usuarios pre-cadastrados no sistema:

```
Email: admin@cars.com
Senha: admin123

Email: user@cars.com
Senha: user123
```

## Endpoints da API

### Autenticacao
```
POST /api/usuarios/login
GET  /api/usuarios/my-profile
```

### Carros
```
GET    /api/carros              - Lista todos (paginado)
GET    /api/carros/{id}         - Busca por ID
GET    /api/carros/search       - Busca com filtros
POST   /api/carros              - Cria novo
PUT    /api/carros/{id}         - Atualiza
DELETE /api/carros/{id}         - Deleta
GET    /api/carros/export-cars  - Exporta CSV
```

## Testes

### Backend
```bash
cd backend
./mvnw test
```

### Frontend
```bash
cd frontend
npm test
```

## Build para Producao

### Backend
```bash
cd backend
./mvnw clean package
```
O arquivo JAR sera gerado em `target/cars-0.0.1-SNAPSHOT.jar`

### Frontend
```bash
cd frontend
npm run build
```
Os arquivos estaticos serao gerados em `build/`

## Configuracoes Importantes

### Backend (application.yaml)
- Porta: 8080
- Banco: H2 em memoria
- CORS: Habilitado para localhost:3000

### Frontend (package.json)
- Porta: 3000
- Proxy para API: http://localhost:8080

## Documentacao Adicional

- `IMPLEMENTACAO.md` - Detalhes tecnicos da implementacao
- `ENTREGA.md` - Documentacao para entrega academica
- `diretrizes_trabalho.md` - Requisitos do projeto

## Resolucao de Problemas

### Porta em uso
Se a porta 8080 ou 3000 ja estiver em uso:

Backend: Altere em `application.yaml`:
```yaml
server:
  port: 8081
```

Frontend: Altere em `package.json`:
```json
"start": "PORT=3001 react-scripts start"
```

### Erro de conexao com banco
Verifique se o H2 esta configurado corretamente em `application.yaml`

### Erro de CORS
Verifique se o `@CrossOrigin` esta presente nos controllers

## Contribuicao

Este projeto foi desenvolvido como trabalho academico da pos-graduacao em Desenvolvimento Full-Stack.

Desenvolvedor: Victor Hugo Leal

## Licenca

Projeto academico - Todos os direitos reservados
