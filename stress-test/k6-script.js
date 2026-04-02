/**
 * Stress Test - Cars Application
 * Ferramenta: k6 (https://k6.io)
 *
 * Instalação: https://k6.io/docs/get-started/installation/
 *   Windows (Chocolatey): choco install k6
 *   Linux:  sudo snap install k6
 *
 * Execução:
 *   k6 run stress-test/k6-script.js
 *   k6 run --env BASE_URL=http://<NODE_IP>:30080 stress-test/k6-script.js
 *
 * Com relatório HTML:
 *   k6 run --out json=results.json stress-test/k6-script.js
 */

import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ─── Métricas customizadas ────────────────────────────────────────────────────
const errorRate       = new Rate('error_rate');
const requestDuration = new Trend('request_duration_ms', true);
const totalRequests   = new Counter('total_requests');

// ─── Configuração dos estágios de carga ──────────────────────────────────────
export const options = {
    stages: [
        { duration: '30s', target: 10  }, // 🔥 Aquecimento: subindo para 10 usuários
        { duration: '1m',  target: 30  }, // 📈 Carga normal: 30 usuários simultâneos
        { duration: '1m',  target: 70  }, // 📈 Carga alta: 70 usuários simultâneos
        { duration: '2m',  target: 100 }, // 💥 Pico de stress: 100 usuários simultâneos
        { duration: '1m',  target: 50  }, // 📉 Redução gradual
        { duration: '30s', target: 0   }, // ❄️  Resfriamento
    ],
    thresholds: {
        // 95% das requisições devem responder em menos de 2 segundos
        'http_req_duration': ['p(95)<2000'],
        // Menos de 10% de erros
        'error_rate': ['rate<0.10'],
        // Tempo médio de resposta menor que 500ms
        'http_req_duration{type:list_cars}': ['avg<500'],
    },
};

// ─── URL base (pode ser sobrescrita via --env BASE_URL=...) ───────────────────
const BASE_URL = __ENV.BASE_URL || 'http://localhost:30080';

// ─── Setup: faz login e retorna o token JWT ───────────────────────────────────
export function setup() {
    console.log(`🚀 Iniciando stress test em: ${BASE_URL}`);

    const loginPayload = JSON.stringify({
        email: 'admin@acme.com',
        password: '123456',
    });

    const loginRes = http.post(
        `${BASE_URL}/api/usuarios/login`,
        loginPayload,
        { headers: { 'Content-Type': 'application/json' } }
    );

    const loginOk = check(loginRes, {
        'login status 200': (r) => r.status === 200,
        'token recebido':   (r) => r.json('token') !== undefined,
    });

    if (!loginOk) {
        console.error(`❌ Falha no login! Status: ${loginRes.status} | Body: ${loginRes.body}`);
    } else {
        console.log('✅ Login realizado com sucesso! Token obtido.');
    }

    return { token: loginRes.json('token') };
}

// ─── Cenário principal executado por cada VU (Virtual User) ──────────────────
export default function (data) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
    };

    // ── Cenário 1: Listagem paginada de carros ────────────────────────────────
    group('Listagem de Carros', () => {
        const page = Math.floor(Math.random() * 10);
        const res = http.get(
            `${BASE_URL}/api/carros?page=${page}&size=10`,
            { headers, tags: { type: 'list_cars' } }
        );

        const ok = check(res, {
            'lista: status 200': (r) => r.status === 200,
            'lista: tem dados':  (r) => r.body && r.body.length > 2,
        });

        errorRate.add(!ok);
        requestDuration.add(res.timings.duration);
        totalRequests.add(1);
    });

    sleep(0.3);

    // ── Cenário 2: Busca de carro por ID aleatório ────────────────────────────
    group('Busca de Carro por ID', () => {
        const id = Math.floor(Math.random() * 50) + 1;
        const res = http.get(
            `${BASE_URL}/api/carros/${id}`,
            { headers, tags: { type: 'get_by_id' } }
        );

        const ok = check(res, {
            'busca por id: status 200 ou 404': (r) => r.status === 200 || r.status === 404,
        });

        errorRate.add(!ok);
        requestDuration.add(res.timings.duration);
        totalRequests.add(1);
    });

    sleep(0.3);

    // ── Cenário 3: Busca com filtros via headers ──────────────────────────────
    group('Busca com Filtros', () => {
        const fabricantes = ['Toyota', 'Ford', 'Volkswagen', 'Fiat', 'Chevrolet'];
        const fabricante  = fabricantes[Math.floor(Math.random() * fabricantes.length)];

        const res = http.get(
            `${BASE_URL}/api/carros/search`,
            {
                headers: { ...headers, fabricante },
                tags: { type: 'search' }
            }
        );

        const ok = check(res, {
            'filtro: status 200': (r) => r.status === 200,
        });

        errorRate.add(!ok);
        requestDuration.add(res.timings.duration);
        totalRequests.add(1);
    });

    sleep(0.3);

    // ── Cenário 4: Criação de carro (operação pesada) ─────────────────────────
    group('Criar Carro (POST)', () => {
        const novoCarro = JSON.stringify({
            modelo:              `Modelo-Stress-${__VU}-${__ITER}`,
            ano:                 2024,
            cor:                 'Azul',
            cavalosDePotencia:   150,
            fabricante:          'Toyota',
            pais:                'Japao',
        });

        const res = http.post(
            `${BASE_URL}/api/carros`,
            novoCarro,
            { headers, tags: { type: 'create_car' } }
        );

        const ok = check(res, {
            'criar: status 201': (r) => r.status === 201,
        });

        errorRate.add(!ok);
        requestDuration.add(res.timings.duration);
        totalRequests.add(1);
    });

    sleep(0.5);

    // ── Cenário 5: Health Check ───────────────────────────────────────────────
    group('Health Check', () => {
        const res = http.get(
            `${BASE_URL}/actuator/health`,
            { tags: { type: 'health' } }
        );

        check(res, {
            'health: status 200': (r) => r.status === 200,
            'health: UP':         (r) => r.json('status') === 'UP',
        });
    });

    sleep(0.5);
}

// ─── Teardown: resumo final ───────────────────────────────────────────────────
export function teardown(data) {
    console.log('');
    console.log('════════════════════════════════════════');
    console.log('  ✅ STRESS TEST FINALIZADO             ');
    console.log('════════════════════════════════════════');
    console.log(`  Base URL: ${BASE_URL}`);
    console.log('  Verifique o dashboard do Grafana para');
    console.log('  visualizar o impacto do teste!       ');
    console.log('  Grafana: http://<NODE_IP>:30300      ');
    console.log('════════════════════════════════════════');
}
