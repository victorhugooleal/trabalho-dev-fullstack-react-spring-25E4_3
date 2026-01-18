# Sistema de Gerenciamento de Carros

Sistema fullstack desenvolvido com Spring Boot e React para gerenciamento de cadastro de carros, com autenticacao JWT e funcionalidades completas de CRUD.

**Link do Repositorio:** https://github.com/victorhugooleal/trabalho-dev-fullstack-react-spring-25E4_3

---

## Tecnologias Utilizadas

### Backend
- Java 21
- Spring Boot 3.4.0
- Spring Security com JWT
- Spring Data JPA
- H2 Database (em memoria)
- Maven 3.9.11
- BCrypt para criptografia de senhas
- OpenCSV para exportacao de dados

### Frontend
- React 18
- React Router DOM para navegacao
- Axios para requisicoes HTTP
- CSS3 para estilizacao

### Infraestrutura
- Docker para containerizacao
- Docker Compose para orquestracao
- Nginx como servidor web para o frontend
- Multi-stage builds para otimizacao

---

## Requisitos

### Para executar com Docker (Recomendado)
- Docker Desktop (versao mais recente)
- Git para clonar o repositorio

### Para executar localmente sem Docker
- Java 21 ou superior
- Node.js 18 ou superior
- Maven 3.8+ (ou usar os wrappers incluidos)

---

## Como Executar com Docker (Recomendado)

Este e o metodo mais simples e recomendado.

1. Clone o repositorio:
```bash
git clone https://github.com/victorhugooleal/trabalho-dev-fullstack-react-spring-25E4_3.git
cd trabalho-dev-fullstack-react-spring-25E4_3
```

2. Certifique-se de que o Docker Desktop esta em execucao.

3. Execute o comando para iniciar os containers:
```bash
docker-compose up --build
```

Aguarde aproximadamente 2 minutos na primeira execucao. O comando ira construir as imagens Docker e iniciar os containers.

4. Acesse a aplicacao:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080/api
   - **Console H2:** http://localhost:8080/h2-console

5. Para parar os containers:
```bash
docker-compose down
```

---

## Como Executar Localmente (Desenvolvimento)

### Backend

1. Navegue ate a pasta backend:
```bash
cd backend
```

2. Execute o projeto com Maven:
```bash
./mvnw spring-boot:run
```

Ou compile primeiro:
```bash
./mvnw clean package
java -jar target/cars-0.0.1-SNAPSHOT.jar
```

O backend estara disponivel em http://localhost:8080

### Frontend

1. Navegue ate a pasta frontend:
```bash
cd frontend
```

2. Instale as dependencias (apenas na primeira vez):
```bash
npm install
```

3. Execute o projeto:
```bash
npm start
```

O frontend abrira automaticamente em http://localhost:3000

---

## Credenciais de Acesso

O sistema ja vem com usuarios pre-cadastrados para testes:

| Email | Senha | Cargo |
|-------|-------|-------|
| admin@acme.com | 123456 | Gerente |
| user@acme.com | 123456 | Vendedor |
| teste@acme.com | 123456 | Analista |

### Console H2 Database

Para acessar o console do banco de dados:
- **URL:** http://localhost:8080/h2-console
- **JDBC URL:** jdbc:h2:mem:db
- **User Name:** sa
- **Password:** (deixar em branco)

---

## Funcionalidades Implementadas

### Autenticacao e Seguranca
- Login com email e senha
- Autenticacao JWT (validade de 7 dias)
- Rotas protegidas no frontend (PrivateRoute)
- Endpoints protegidos no backend
- Logout seguro (remove token do localStorage)
- Hash de senhas com BCrypt
- Interceptor Axios para envio automatico do token

### CRUD de Carros
- Listar carros com paginacao (10 por pagina)
- Buscar carros por modelo, fabricante ou pais (case insensitive)
- Criar novo carro com validacoes
- Editar carro existente
- Excluir carro com confirmacao
- Validacoes de campos no frontend e backend

### Exportacao de Dados
- Exportar todos os carros em formato CSV
- Endpoint protegido por autenticacao JWT
- Download automatico do arquivo

---

## Estrutura do Projeto

```
trabalho-dev-fullstack-react-spring-25E4_3/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/acme/cars/
│   │   │   │   ├── config/          # SecurityConfig, JwtAuthenticationFilter
│   │   │   │   ├── controller/      # CarroController, UsuarioController
│   │   │   │   ├── dto/              # AuthUserDTO
│   │   │   │   ├── exception/        # Excecoes customizadas
│   │   │   │   ├── model/            # Carro, Usuario (entidades JPA)
│   │   │   │   ├── payload/          # AuthPayload, CriteriaRequest
│   │   │   │   ├── repository/       # CarroRepository, UsuarioRepository
│   │   │   │   └── service/          # SecurityService, TokenService, CsvService
│   │   │   └── resources/
│   │   │       ├── application.yaml  # Configuracoes do Spring
│   │   │       └── data.sql          # Dados iniciais (130 carros + 3 usuarios)
│   │   └── test/
│   ├── Dockerfile                    # Multi-stage build (Maven + Corretto)
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/               # PrivateRoute
│   │   ├── pages/                    # Login, CarrosList, CarroForm
│   │   ├── services/                 # api, authService, carroService
│   │   ├── App.js                    # Rotas principais
│   │   └── index.js
│   ├── Dockerfile                    # Multi-stage build (Node + Nginx)
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml                # Orquestracao dos containers
├── README.md
├── ENTREGA.md                        # Documentacao completa de entrega
└── diretrizes_trabalho.md
```

---

## Endpoints da API

### Autenticacao
- `POST /api/usuarios/login` - Login (publico)
- `GET /api/usuarios/my-profile` - Perfil do usuario (protegido)

### Carros
- `GET /api/carros?page=0&size=10` - Listar carros paginado (publico)
- `GET /api/carros/{id}` - Buscar carro por ID (protegido)
- `GET /api/carros/search?modelo=&fabricante=&pais=` - Buscar com filtros (publico)
- `POST /api/carros` - Criar carro (protegido)
- `PUT /api/carros/{id}` - Atualizar carro (protegido)
- `DELETE /api/carros/{id}` - Excluir carro (protegido)
- `GET /api/carros/export-cars` - Exportar CSV (protegido)

---

## Validacoes Implementadas

### Backend (Bean Validation)
- Campos obrigatorios: modelo, cor, ano, cavalos de potencia, fabricante, pais
- Modelo: 2 a 100 caracteres
- Ano: entre 1886 e 2030
- Cavalos de potencia: entre 1 e 2000
- Email: formato valido
- Tamanho minimo e maximo de strings

### Frontend
- Validacao de campos obrigatorios
- Validacao de formato de email
- Validacao de ranges numericos (ano, potencia)
- Feedback visual de erros
- Confirmacao antes de exclusoes

---

## Troubleshooting

### Porta ja em uso
Se as portas 3000 ou 8080 ja estiverem em uso:

1. Parar o servico que esta usando a porta
2. Ou modificar as portas no `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8081:8080"  # Alterar porta externa
  frontend:
    ports:
      - "3001:80"    # Alterar porta externa
```

### Erro de permissao no Maven (Windows)
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Containers nao inicializam
Verifique os logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Erro de CORS
Verifique se o backend esta rodando e o CORS esta configurado em `SecurityConfig.java`

---

## Observacoes Importantes

- O banco de dados H2 e em memoria, os dados sao perdidos ao reiniciar o backend
- Os dados iniciais (130 carros e 3 usuarios) sao carregados automaticamente do `data.sql`
- O frontend usa localStorage para armazenar o token JWT
- As senhas sao armazenadas com hash BCrypt no banco de dados
- CORS esta habilitado para desenvolvimento (localhost:3000)
- Token JWT tem validade de 7 dias

---

## Commits e Versionamento

O projeto foi desenvolvido de forma incremental com commits convencionais:

1. `feat: implementa estrutura base do backend com Spring Boot`
2. `feat: adiciona autenticacao JWT e seguranca`
3. `feat: implementa CRUD completo de carros`
4. `feat: adiciona frontend React com todas as funcionalidades`
5. `fix: corrige hash BCrypt e ajusta autenticacao`
6. `fix: corrige paginacao e interacao com filtros de busca`

---

## Documentacao Adicional

- **ENTREGA.md** - Documentacao completa para entrega academica com screenshots e testes
- **diretrizes_trabalho.md** - Requisitos originais do projeto

---

## Autor

**Victor Hugo Leal**  
Trabalho de Pos-Graduacao em Desenvolvimento Full Stack com Spring Boot e React  
Janeiro de 2026

---

## Licenca

Projeto academico - Todos os direitos reservados
