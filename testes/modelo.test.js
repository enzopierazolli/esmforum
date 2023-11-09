const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando adição de respostas a perguntas', () => {
  const perguntaId = modelo.cadastrar_pergunta('A, B ou C?');
  
  modelo.cadastrar_resposta(perguntaId, 'A');
  modelo.cadastrar_resposta(perguntaId, 'B');
  modelo.cadastrar_resposta(perguntaId, 'C');
  
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(1);

  expect(perguntas[0].num_respostas).toBe(3);
  expect(perguntas[0].num_respostas).not.toBe(6);
});

test('Testando busca de uma pergunta', () => {
  const texto_pergunta = 'Quem foi o campeão da Copa do Mundo 1512?'

  const perguntaId = modelo.cadastrar_pergunta(texto_pergunta);
  modelo.cadastrar_resposta(perguntaId, 'ST')

  const pergunta = modelo.get_pergunta(perguntaId);
  expect(pergunta.texto).toBe(texto_pergunta);
});

test('Testando listagem de respostas', () => {
  const perguntaId = modelo.cadastrar_pergunta('Qual melhor banda do mundo?');
  
  modelo.cadastrar_resposta(perguntaId, 'Beatles');
  modelo.cadastrar_resposta(perguntaId, 'Rolling Stones');
  modelo.cadastrar_resposta(perguntaId, 'Led Zeppelin');
  modelo.cadastrar_resposta(perguntaId, 'Pearl Jam');
  
  const respostas = modelo.get_respostas(perguntaId);
  
  expect(respostas.length).toBe(4);
  expect(respostas.length).not.toBe(9);
});
