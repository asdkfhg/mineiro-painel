export default function Home() {
  return (
    <>
      <div className="pole"></div>
      <div className="wrap">
        <header className="hero">
          <div className="kicker">
            Centro de Piracicaba · Travessa Orestes Miglioranza, nº 36
          </div>
          <h1 className="display">
            CORTE NOVO.
            <br />
            PRIMEIRA VEZ,
            <br />
            <span>METADE DO PREÇO.</span>
          </h1>
          <p className="lede">
            Degradê, barba desenhada e freestyle com o Mineiro. Sua primeira
            visita sai com 50% de desconto — sem pegadinha.
          </p>
          <a
            className="cta"
            href="https://wa.me/5519994006445?text=Oi%2C+tudo+bem%3F%0AGostaria+de+agendar+um+hor%C3%A1rio+e+aproveitar+os+50%25+de+desconto+na+primeira+vez."
            target="_blank"
            rel="noopener"
          >
            Agendar no WhatsApp →
          </a>
          <div className="cta-note">Resposta rápida · sem taxa de agendamento</div>
        </header>

        <section id="oferta">
          <h2 className="display">A oferta</h2>
          <div className="offer-card">
            <div className="offer-big">50%</div>
            <div className="offer-text">
              de desconto em <strong>qualquer serviço</strong>, válido só na
              sua <strong>primeira visita</strong>. Ex: <strong>Cabelo e
              barba</strong> sai por <strong>R$ 45</strong> (de R$ 90). Você
              sai já com o próximo horário marcado, se quiser garantir o
              desconto de retorno.
            </div>
          </div>
        </section>

        <section id="servicos">
          <h2 className="display">Serviços</h2>
          <ul className="services">
            <li>
              <span>Corte de cabelo</span>
              <span className="price">R$ 50</span>
            </li>
            <li>
              <span>Barba</span>
              <span className="price">R$ 50</span>
            </li>
            <li>
              <span>
                Cabelo e barba
                <span className="note">combo completo</span>
              </span>
              <span className="price">R$ 90</span>
            </li>
            <li>
              <span>Sobrancelha</span>
              <span className="price">R$ 20</span>
            </li>
            <li>
              <span>Luzes</span>
              <span className="price">R$ 120</span>
            </li>
            <li>
              <span>Limpeza de pele</span>
              <span className="price">R$ 40</span>
            </li>
            <li>
              <span>Nariz</span>
              <span className="price">R$ 25</span>
            </li>
            <li>
              <span>Orelhas</span>
              <span className="price">R$ 25</span>
            </li>
            <li>
              <span>
                Nariz e orelhas
                <span className="note">combo</span>
              </span>
              <span className="price">R$ 30</span>
            </li>
          </ul>
        </section>

        <section id="como-funciona">
          <h2 className="display">Como funciona</h2>
          <div className="steps">
            <div className="step">
              <div className="step-mark">1</div>
              <p>
                <strong>Chama no WhatsApp</strong>
                Manda uma mensagem pelo botão acima, já cai direto na conversa.
              </p>
            </div>
            <div className="step">
              <div className="step-mark">2</div>
              <p>
                <strong>Escolhe o horário</strong>
                O Mineiro confirma o melhor dia e horário pra você.
              </p>
            </div>
            <div className="step">
              <div className="step-mark">3</div>
              <p>
                <strong>Aparece e aproveita os 50%</strong>
                Desconto aplicado na hora, sem cadastro complicado.
              </p>
            </div>
          </div>
        </section>

        <section id="local">
          <h2 className="display">Onde fica</h2>
          <div className="info-row">
            <span>Endereço</span>
            <span>Travessa Orestes Miglioranza, nº 36 — Centro</span>
          </div>
          <div className="info-row">
            <span>Cidade</span>
            <span>Piracicaba, SP</span>
          </div>
          <div className="info-row">
            <span>Instagram</span>
            <span>
              <a
                href="https://www.instagram.com/mineiro.obarbeiro/"
                target="_blank"
                rel="noopener"
                style={{ color: "var(--accent)" }}
              >
                @mineiro.obarbeiro
              </a>
            </span>
          </div>
        </section>

        <footer>
          Mineiro, o Barbeiro · Centro, Piracicaba
          <br />
          <a href="https://wa.me/5519994006445">wa.me/5519994006445</a>
        </footer>
      </div>
    </>
  );
}
