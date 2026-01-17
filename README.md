# Projeto Fullstack: Spring Boot (backend) + React (frontend)

Este repositório contém um sistema completo de gerenciamento de carros desenvolvido como trabalho de pós-graduação. O projeto implementa autenticação JWT, CRUD completo, exportação de dados e está pronto para execução com Docker.

## Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 3.4.0
- Spring Security com JWT
- Spring Data JPA
- H2 Database (em memória)
- Maven
- BCrypt para hash de senhas

### Frontend
- React 18
- React Router DOM
- Axios
- CSS puro (responsivo)

### DevOps
- Docker
- Docker Compose
- Nginx (para servir frontend em produção)

## Pré-requisitos

### Para executar com Docker (recomendado)
- Docker instalado
- Docker Compose instalado

### Para executar localmente sem Docker
- Java 21 ou superior
- Node.js 18 ou superior
- Maven (opcional, há wrappers incluídos)

## Como executar com Docker (recomendado)

Este é o método mais simples e recomendado para avaliação do professor.

1. Clone o repositório ou extraia o arquivo do projeto

2. Na raiz do projeto, execute:

```powershell
docker-compose up --build
```

3. Aguarde a construção das imagens e inicialização dos serviços (pode levar alguns minutos na primeira execução)

4. Acesse a aplicação:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Console H2: http://localhost:8080/h2-console

5. Para parar os containers:

```powershell
docker-compose down
```

## Como executar localmente (desenvolvimento)

### Backend

1. Navegue até a pasta backend:

```powershell
cd backend
```

2. Execute o projeto com Maven:

```powershell
.\mvnw spring-boot:run
```

Ou, se preferir compilar primeiro:

```powershell
.\mvnw clean package
java -jar target/cars-0.0.1-SNAPSHOT.jar
```

O backend estará disponível em http://localhost:8080

### Frontend

1. Navegue até a pasta frontend:

```powershell
cd frontend
```

2. Instale as dependências (apenas na primeira vez):

```powershell
npm install
```

3. Execute o projeto:

```powershell
npm start
```

O frontend abrirá automaticamente em http://localhost:3000

## Usuários de Teste

O sistema já vem com usuários pré-cadastrados para testes:

| Email | Senha | Cargo |
|-------|-------|-------|
| admin@acme.com | 123456 | Gerente |
| user@acme.com | 123456 | Vendedor |
| teste@acme.com | 123456 | Analista |

## Funcionalidades Implementadas

### Autenticação e Segurança
- Login com email e senha
- Autenticação JWT
- Rotas protegidas no frontend
- Endpoints protegidos no backend
- Logout seguro
- Hash de senhas com BCrypt

### CRUD de Carros
- Listar carros com paginação
- Buscar carros por modelo, fabricante ou país
- Criar novo carro
- Editar carro existente
- Excluir carro
- Validações de campos no frontend e backend

### Exportação de Dados
- Exportar todos os carros em formato CSV
- Endpoint protegido por autenticação JWT

## Estrutura do Projeto

```
trabalho-dev-fullstack-react-spring-25E4_3/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/acme/cars/
│   │   │   │   ├── config/          # Configurações de segurança e JWT
│   │   │   │   ├── controller/      # Controllers REST
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── exception/        # Exceções customizadas
│   │   │   │   ├── model/            # Entidades JPA
│   │   │   │   ├── payload/          # Payloads de requisição
│   │   │   │   ├── repository/       # Repositórios JPA
│   │   │   │   └── service/          # Serviços de negócio
│   │   │   └── resources/
│   │   │       ├── application.yaml  # Configurações do Spring
│   │   │       └── data.sql          # Dados iniciais
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── services/            # Serviços de API
│   │   ├── App.js               # Componente principal e rotas
│   │   └── index.js             # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Endpoints da API

### Autenticação
- `POST /api/usuarios/login` - Login (público)
- `GET /api/usuarios/my-profile` - Perfil do usuário (protegido)

### Carros
- `GET /api/carros` - Listar carros com paginação (público)
- `GET /api/carros/{id}` - Buscar carro por ID (público)
- `GET /api/carros/search` - Buscar carros com filtros (público)
- `POST /api/carros` - Criar carro (protegido)
- `PUT /api/carros/{id}` - Atualizar carro (protegido)
- `DELETE /api/carros/{id}` - Excluir carro (protegido)
- `GET /api/carros/export-cars` - Exportar CSV (protegido)

## Validações Implementadas

### Backend
- Campos obrigatórios (modelo, cor, fabricante, país)
- Ano entre 1886 e 2030
- Potência entre 50 e 2000 HP
- Email válido e único
- Tamanho mínimo e máximo de strings

### Frontend
- Validação de campos obrigatórios
- Validação de formato de email
- Validação de ranges numéricos
- Feedback visual de erros

## Troubleshooting

### Porta já em uso
Se as portas 3000 ou 8080 já estiverem em uso, você pode:

1. Parar o serviço que está usando a porta
2. Ou modificar as portas no docker-compose.yml

### Erro de permissão no Maven
No Windows, se houver erro de permissão:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Containers não inicializam
Verifique os logs:

```powershell
docker-compose logs backend
docker-compose logs frontend
```

## Observações Importantes

- O banco de dados H2 é em memória, então os dados são perdidos ao reiniciar o backend
- Os dados iniciais (130 carros e 3 usuários) são carregados automaticamente do data.sql
- O frontend usa localStorage para armazenar o token JWT
- As senhas são armazenadas com hash BCrypt no banco de dados
- CORS está habilitado para desenvolvimento

## Commits e Versionamento

O projeto foi desenvolvido de forma incremental com commits bem descritos:

1. Estrutura base do projeto
2. Implementação de validações e segurança no backend
3. Implementação do frontend React completo
4. Configuração Docker para deploy

## Autor

Desenvolvido como trabalho de pós-graduação em Desenvolvimento Fullstack.
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
