import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Gabriel Alberto Imóveis',
  description:
    'Entenda como a Gabriel Alberto Imóveis trata seus dados pessoais, em conformidade com a LGPD. Saiba quais informações coletamos, como utilizamos e quais são seus direitos.',
  keywords: [
    'política de privacidade',
    'LGPD',
    'proteção de dados',
    'privacidade',
    'dados pessoais',
  ],
  alternates: {
    canonical: 'https://gabrielalbertoimoveis.com.br/politica-de-privacidade',
  },
  openGraph: {
    title: 'Política de Privacidade — Gabriel Alberto Imóveis',
    description:
      'Entenda como a Gabriel Alberto Imóveis trata seus dados pessoais, em conformidade com a LGPD.',
    url: 'https://gabrielalbertoimoveis.com.br/politica-de-privacidade',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Política de Privacidade — Gabriel Alberto Imóveis',
    description:
      'Entenda como a Gabriel Alberto Imóveis trata seus dados pessoais, em conformidade com a LGPD.',
  },
}

export default function PoliticaPrivacidadePage() {
  // ⚙️ CONFIGURAÇÕES - Altere aqui conforme necessário
  const CONTATO_PRIVACIDADE = 'privacidade@gabrielalbertoimoveis.com.br'
  const ULTIMA_ATUALIZACAO = 'Janeiro de 2025'
  // Para mencionar ferramentas específicas no futuro, edite a seção "Compartilhamento de dados com terceiros"

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      {/* Badge de última atualização */}
      <div className="mb-6">
        <Badge variant="outline" className="text-sm">
          Última atualização: {ULTIMA_ATUALIZACAO}
        </Badge>
      </div>

      {/* Título principal */}
      <h1 className="text-4xl md:text-5xl font-bold mb-8">
        Política de Privacidade
      </h1>

      {/* Conteúdo da política */}
      <section className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
        {/* Introdução */}
        <div>
          <h2>1. Introdução</h2>
          <p>
            Esta é a Política de Privacidade do site{' '}
            <strong>Gabriel Alberto Imóveis</strong>, acessível através do
            endereço{' '}
            <a
              href="https://gabrielalbertoimoveis.com.br"
              className="text-primary hover:underline"
            >
              gabrielalbertoimoveis.com.br
            </a>
            . Esta política descreve como coletamos, utilizamos, armazenamos e
            protegemos seus dados pessoais.
          </p>
          <p>
            O presente documento foi elaborado em conformidade com a{' '}
            <strong>Lei Geral de Proteção de Dados Pessoais (LGPD)</strong>,
            Lei nº 13.709/2018, e tem como objetivo garantir a transparência
            sobre o tratamento de dados pessoais realizado por nossa empresa.
          </p>
          <p>
            Ao navegar em nosso site, preencher formulários, entrar em contato
            conosco ou utilizar nossos serviços, você concorda com as práticas
            descritas nesta Política de Privacidade.
          </p>
        </div>

        {/* Quem somos */}
        <div>
          <h2>2. Quem Somos</h2>
          <p>
            A <strong>Gabriel Alberto Imóveis</strong> é um site de
            consultoria imobiliária operado por{' '}
            <strong>Gabriel Alberto</strong>, corretor de imóveis registrado no
            CRECI sob o número <strong>267769</strong>, com atuação na cidade de
            São Paulo, estado de São Paulo.
          </p>
          <p>
            Nosso site é utilizado para a divulgação de imóveis disponíveis para
            compra, venda ou investimento, bem como para a captação de
            interessados em serviços imobiliários. Oferecemos consultoria
            especializada em moradia e investimento imobiliário, com atendimento
            personalizado no estilo buyer's agent.
          </p>
        </div>

        {/* Quais dados coletamos */}
        <div>
          <h2>3. Quais Dados Coletamos</h2>
          <p>
            Coletamos diferentes tipos de dados pessoais, dependendo da forma
            como você interage com nosso site e serviços:
          </p>

          <h3>3.1. Dados Fornecidos pelo Usuário</h3>
          <p>Quando você preenche formulários ou entra em contato conosco:</p>
          <ul>
            <li>
              <strong>Dados de identificação:</strong> nome completo, e-mail,
              telefone (fixo e/ou celular), WhatsApp
            </li>
            <li>
              <strong>Dados de interesse:</strong> tipo de imóvel de interesse
              (apartamento, casa, terreno, etc.), região de preferência, faixa
              de valor, finalidade (moradia ou investimento)
            </li>
            <li>
              <strong>Dados de comunicação:</strong> mensagens enviadas através
              de formulários de contato, comentários, solicitações de
              informações
            </li>
            <li>
              <strong>Dados para newsletter:</strong> e-mail para recebimento de
              conteúdos, oportunidades e atualizações
            </li>
          </ul>

          <h3>3.2. Dados Coletados Automaticamente</h3>
          <p>
            Quando você navega em nosso site, coletamos automaticamente:
          </p>
          <ul>
            <li>
              <strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo
              (desktop, mobile, tablet), sistema operacional, navegador
              utilizado, resolução de tela
            </li>
            <li>
              <strong>Dados de navegação:</strong> páginas visitadas, tempo de
              permanência em cada página, links clicados, origem do acesso
              (referrer), data e hora de acesso
            </li>
            <li>
              <strong>Cookies e tecnologias similares:</strong> informações
              armazenadas em cookies, pixel tags e outras tecnologias de
              rastreamento (conforme detalhado na seção 7)
            </li>
          </ul>

          <h3>3.3. Dados de Formulários Específicos</h3>
          <p>
            Dependendo do formulário preenchido, podemos coletar informações
            adicionais, como:
          </p>
          <ul>
            <li>Simuladores de financiamento: renda, valor do imóvel desejado</li>
            <li>
              Cadastro para oportunidades exclusivas: perfil de investidor,
              experiência prévia com imóveis
            </li>
            <li>
              Solicitação de avaliação de imóvel: endereço do imóvel, tipo,
              características
            </li>
          </ul>
        </div>

        {/* Como utilizamos os dados */}
        <div>
          <h2>4. Como Utilizamos os Dados Pessoais</h2>
          <p>
            Utilizamos seus dados pessoais para as seguintes finalidades:
          </p>

          <h3>4.1. Atendimento e Comunicação</h3>
          <ul>
            <li>
              Responder a suas solicitações, dúvidas e mensagens enviadas
              através de formulários de contato
            </li>
            <li>
              Entrar em contato via telefone, e-mail ou WhatsApp para oferecer
              atendimento personalizado
            </li>
            <li>
              Enviar informações sobre imóveis que correspondam ao seu perfil
              de interesse
            </li>
            <li>
              Agendar visitas, reuniões e apresentações de imóveis
            </li>
          </ul>

          <h3>4.2. Marketing e Comunicação Comercial</h3>
          <ul>
            <li>
              Enviar newsletters com oportunidades de imóveis, lançamentos e
              conteúdos educativos sobre o mercado imobiliário
            </li>
            <li>
              Enviar propostas comerciais, ofertas especiais e informações sobre
              novos imóveis disponíveis
            </li>
            <li>
              Realizar campanhas de marketing direto, respeitando suas
              preferências de comunicação
            </li>
          </ul>

          <h3>4.3. Análises e Melhorias</h3>
          <ul>
            <li>
              Analisar padrões de navegação e comportamento dos usuários para
              entender melhor a demanda e os interesses
            </li>
            <li>
              Identificar preferências por regiões, tipos de imóveis e faixas de
              valor para aprimorar nossos serviços
            </li>
            <li>
              Realizar estudos de mercado e análises estatísticas para melhorar
              a experiência do usuário
            </li>
            <li>
              Medir a eficácia de campanhas publicitárias e estratégias de
              marketing
            </li>
          </ul>

          <h3>4.4. Publicidade e Remarketing</h3>
          <ul>
            <li>
              Exibir anúncios personalizados em plataformas de mídia e redes
              sociais com base em seu interesse em imóveis
            </li>
            <li>
              Realizar remarketing para usuários que visitaram nosso site,
              mostrando anúncios relevantes em outros sites e plataformas
            </li>
            <li>
              Utilizar ferramentas de análise e publicidade para otimizar
              campanhas e alcançar públicos interessados
            </li>
          </ul>

          <h3>4.5. Cumprimento de Obrigações Legais</h3>
          <ul>
            <li>
              Cumprir obrigações legais e regulatórias aplicáveis ao setor
              imobiliário
            </li>
            <li>
              Atender solicitações de autoridades competentes, quando
              necessário
            </li>
            <li>
              Manter registros conforme exigido por lei ou regulamentação
              profissional
            </li>
          </ul>
        </div>

        {/* Base legal */}
        <div>
          <h2>5. Base Legal para o Tratamento de Dados (LGPD)</h2>
          <p>
            O tratamento de seus dados pessoais é realizado com base nas
            seguintes hipóteses legais previstas na LGPD:
          </p>
          <ul>
            <li>
              <strong>Consentimento do titular:</strong> quando você fornece
              consentimento explícito, como ao preencher formulários, assinar
              newsletter ou autorizar o envio de comunicações comerciais
            </li>
            <li>
              <strong>Legítimo interesse:</strong> para fins de marketing direto
              e comunicação sobre serviços relacionados ao interesse demonstrado
              pelo usuário, desde que não haja prejuízo aos direitos e liberdades
              fundamentais do titular
            </li>
            <li>
              <strong>Cumprimento de obrigações legais e regulatórias:</strong>{' '}
              quando necessário para atender a obrigações legais, contratuais ou
              regulatórias aplicáveis ao exercício da atividade imobiliária
            </li>
            <li>
              <strong>Execução de contrato ou procedimentos preliminares:</strong>{' '}
              quando os dados são necessários para a execução de contrato ou
              procedimentos relacionados à prestação de serviços imobiliários
            </li>
          </ul>
        </div>

        {/* Cookies */}
        <div>
          <h2>6. Uso de Cookies e Tecnologias Similares</h2>
          <p>
            <strong>O que são cookies?</strong> Cookies são pequenos arquivos de
            texto armazenados em seu dispositivo (computador, tablet ou
            smartphone) quando você visita um site. Eles permitem que o site
            reconheça seu dispositivo e armazene algumas informações sobre suas
            preferências ou ações passadas.
          </p>
          <p>Utilizamos cookies para as seguintes finalidades:</p>
          <ul>
            <li>
              <strong>Funcionalidade:</strong> lembrar suas preferências e
              configurações para melhorar sua experiência de navegação
            </li>
            <li>
              <strong>Análise e medição:</strong> coletar informações sobre como
              você utiliza nosso site, como páginas visitadas e tempo de
              permanência, para entender melhor o comportamento dos usuários e
              aprimorar nossos serviços
            </li>
            <li>
              <strong>Publicidade:</strong> exibir anúncios relevantes baseados
              em seus interesses e histórico de navegação, tanto em nosso site
              quanto em outros sites e plataformas
            </li>
            <li>
              <strong>Remarketing:</strong> identificar visitantes que
              demonstraram interesse em nossos serviços para exibir anúncios
              personalizados posteriormente
            </li>
          </ul>
          <p>
            <strong>Gerenciamento de cookies:</strong> Você pode gerenciar ou
            desabilitar cookies através das configurações do seu navegador.
            No entanto, ao desabilitar cookies, algumas funcionalidades do site
            podem não funcionar corretamente. Para mais informações sobre como
            gerenciar cookies, consulte as instruções do seu navegador:
          </p>
          <ul>
            <li>
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Chrome
              </a>
            </li>
            <li>
              <a
                href="https://support.mozilla.org/pt-BR/kb/ative-e-desative-cookies-que-sites-usam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a
                href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Safari
              </a>
            </li>
            <li>
              <a
                href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Microsoft Edge
              </a>
            </li>
          </ul>
        </div>

        {/* Compartilhamento com terceiros */}
        <div>
          <h2>7. Compartilhamento de Dados com Terceiros</h2>
          <p>
            Podemos compartilhar seus dados pessoais com os seguintes tipos de
            terceiros, sempre de forma segura e em conformidade com a LGPD:
          </p>

          <h3>7.1. Prestadores de Serviços</h3>
          <ul>
            <li>
              <strong>Ferramentas de e-mail marketing:</strong> plataformas que
              nos auxiliam no envio de newsletters e comunicações comerciais
            </li>
            <li>
              <strong>Plataformas de CRM:</strong> sistemas de gestão de
              relacionamento com clientes para organização e acompanhamento de
              leads e contatos
            </li>
            <li>
              <strong>Ferramentas de análise e publicidade:</strong> serviços
              de analytics e plataformas de anúncios para medir audiência,
              analisar comportamento dos usuários e exibir anúncios relevantes
              (ex.: Google Analytics, Meta Ads, entre outras)
            </li>
            <li>
              <strong>Serviços de hospedagem e infraestrutura:</strong> provedores
              de serviços em nuvem que armazenam e processam nossos dados
            </li>
          </ul>

          <h3>7.2. Parceiros Imobiliários</h3>
          <p>
            Eventualmente, podemos compartilhar dados com:
          </p>
          <ul>
            <li>
              <strong>Incorporadoras e construtoras:</strong> quando você
              demonstra interesse em lançamentos ou imóveis específicos de
              parceiros, para que possam entrar em contato diretamente
            </li>
            <li>
              <strong>Imobiliárias parceiras:</strong> quando necessário para
              atender seu interesse em imóveis que não estão diretamente em nosso
              portfólio, sempre com seu conhecimento e consentimento
            </li>
          </ul>
          <p>
            <strong>Importante:</strong> Não vendemos, alugamos ou compartilhamos
            seus dados pessoais de forma indiscriminada. Todo compartilhamento é
            realizado exclusivamente para as finalidades descritas nesta política
            e com empresas que adotam medidas adequadas de proteção de dados.
          </p>
        </div>

        {/* Armazenamento e segurança */}
        <div>
          <h2>8. Armazenamento e Segurança dos Dados</h2>
          <p>
            <strong>Armazenamento:</strong> Seus dados pessoais são armazenados
            em servidores de serviços de nuvem, que podem estar localizados no
            Brasil ou no exterior. Adotamos medidas técnicas e organizacionais
            adequadas para proteger seus dados contra acesso não autorizado,
            perda, destruição ou alteração.
          </p>
          <p>
            <strong>Medidas de segurança:</strong> Utilizamos tecnologias de
            criptografia, controle de acesso, monitoramento de segurança e outras
            boas práticas para proteger seus dados. No entanto, é importante
            ressaltar que nenhum sistema de transmissão ou armazenamento de dados
            é 100% seguro, e não podemos garantir segurança absoluta.
          </p>
          <p>
            <strong>Prazo de retenção:</strong> Mantemos seus dados pessoais
            apenas pelo tempo necessário para cumprir as finalidades descritas
            nesta política, salvo quando a retenção for necessária para cumprir
            obrigações legais ou regulatórias, resolver disputas ou fazer valer
            nossos acordos.
          </p>
        </div>

        {/* Direitos do titular */}
        <div>
          <h2>9. Direitos do Titular de Dados (LGPD)</h2>
          <p>
            De acordo com a LGPD, você possui os seguintes direitos em relação
            aos seus dados pessoais:
          </p>
          <ul>
            <li>
              <strong>Confirmação da existência de tratamento:</strong> direito
              de saber se tratamos seus dados pessoais
            </li>
            <li>
              <strong>Acesso aos dados:</strong> direito de obter informações
              sobre quais dados pessoais tratamos e como os utilizamos
            </li>
            <li>
              <strong>Correção de dados:</strong> direito de solicitar a
              correção de dados incompletos, inexatos ou desatualizados
            </li>
            <li>
              <strong>Anonimização, bloqueio ou eliminação:</strong> direito de
              solicitar a anonimização, bloqueio ou eliminação de dados
              desnecessários, excessivos ou tratados em desconformidade com a
              LGPD
            </li>
            <li>
              <strong>Portabilidade dos dados:</strong> direito de solicitar a
              portabilidade de seus dados para outro fornecedor de serviços,
              quando tecnicamente viável
            </li>
            <li>
              <strong>Eliminação dos dados:</strong> direito de solicitar a
              eliminação dos dados pessoais tratados com base em consentimento,
              exceto nas hipóteses previstas em lei
            </li>
            <li>
              <strong>Revogação do consentimento:</strong> direito de revogar
              seu consentimento a qualquer momento, quando o tratamento for
              baseado em consentimento
            </li>
            <li>
              <strong>Informação sobre compartilhamento:</strong> direito de
              obter informações sobre as entidades públicas e privadas com as
              quais compartilhamos seus dados
            </li>
            <li>
              <strong>Informação sobre a possibilidade de não consentir:</strong>{' '}
              direito de ser informado sobre a possibilidade de não fornecer
              consentimento e sobre as consequências da negativa
            </li>
            <li>
              <strong>Oposição ao tratamento:</strong> direito de se opor ao
              tratamento realizado com base em legítimo interesse, quando houver
              descumprimento da LGPD
            </li>
          </ul>
          <p>
            <strong>Como exercer seus direitos:</strong> Para exercer qualquer
            um desses direitos, entre em contato conosco através do e-mail{' '}
            <a
              href={`mailto:${CONTATO_PRIVACIDADE}`}
              className="text-primary hover:underline"
            >
              {CONTATO_PRIVACIDADE}
            </a>
            , informando qual direito deseja exercer e fornecendo informações
            que permitam sua identificação. Responderemos sua solicitação no
            prazo de até 15 (quinze) dias, conforme previsto na LGPD.
          </p>
        </div>

        {/* Contato */}
        <div>
          <h2>10. Como Entrar em Contato</h2>
          <p>
            Para questões relacionadas a esta Política de Privacidade, tratamento
            de dados pessoais ou para exercer seus direitos como titular de
            dados, entre em contato conosco:
          </p>
          <ul>
            <li>
              <strong>E-mail de privacidade:</strong>{' '}
              <a
                href={`mailto:${CONTATO_PRIVACIDADE}`}
                className="text-primary hover:underline"
              >
                {CONTATO_PRIVACIDADE}
              </a>
            </li>
            <li>
              <strong>Assunto:</strong> Ao enviar um e-mail, por favor, inclua
              no assunto "Política de Privacidade" ou "LGPD" para agilizar o
              atendimento
            </li>
          </ul>
          <p>
            Através desse canal, você pode solicitar:
          </p>
          <ul>
            <li>Acesso aos seus dados pessoais</li>
            <li>Correção ou atualização de dados</li>
            <li>Exclusão de dados</li>
            <li>Revogação de consentimento</li>
            <li>Esclarecimentos sobre o tratamento de dados</li>
            <li>Outras solicitações relacionadas à proteção de dados</li>
          </ul>
        </div>

        {/* Links para terceiros */}
        <div>
          <h2>11. Links para Sites de Terceiros</h2>
          <p>
            Nosso site pode conter links para sites de terceiros, como
            construtoras, incorporadoras, portais imobiliários ou outros
            parceiros. Ao clicar nesses links e ser redirecionado para outros
            sites, esta Política de Privacidade não se aplica mais.
          </p>
          <p>
            Recomendamos que você leia as políticas de privacidade de cada site
            que visitar, pois não temos controle sobre e não nos responsabilizamos
            pelas práticas de privacidade ou pelo conteúdo de sites de terceiros.
          </p>
        </div>

        {/* Atualizações */}
        <div>
          <h2>12. Atualizações desta Política de Privacidade</h2>
          <p>
            Podemos atualizar esta Política de Privacidade periodicamente para
            refletir mudanças em nossas práticas, serviços, requisitos legais ou
            por outros motivos operacionais, técnicos ou legais.
          </p>
          <p>
            Quando houver alterações significativas, notificaremos você através
            de:
          </p>
          <ul>
            <li>E-mail (quando aplicável)</li>
            <li>Aviso em destaque em nosso site</li>
            <li>Atualização da data de "Última atualização" no topo desta página</li>
          </ul>
          <p>
            Recomendamos que você revise esta política periodicamente para se
            manter informado sobre como protegemos seus dados pessoais.
          </p>
        </div>

        {/* Disposições gerais */}
        <div>
          <h2>13. Disposições Gerais</h2>
          <p>
            Ao continuar navegando em nosso site, preencher formulários, entrar
            em contato conosco ou utilizar nossos serviços, você reconhece que
            leu, compreendeu e concorda com os termos desta Política de
            Privacidade.
          </p>
          <p>
            Se você não concordar com esta política, solicitamos que não utilize
            nosso site ou serviços. Caso tenha dúvidas ou precise de
            esclarecimentos, entre em contato conosco através do e-mail{' '}
            <a
              href={`mailto:${CONTATO_PRIVACIDADE}`}
              className="text-primary hover:underline"
            >
              {CONTATO_PRIVACIDADE}
            </a>
            .
          </p>
          <p>
            Esta Política de Privacidade é regida pela legislação brasileira,
            especialmente pela Lei Geral de Proteção de Dados Pessoais (Lei nº
            13.709/2018) e pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).
          </p>
        </div>

        {/* Informações de contato final */}
        <div className="border-t pt-6 mt-8">
          <p className="text-sm text-muted-foreground">
            <strong>Gabriel Alberto Imóveis</strong>
            <br />
            Corretor de Imóveis CRECI 267769
            <br />
            São Paulo, SP, Brasil
            <br />
            E-mail de privacidade:{' '}
            <a
              href={`mailto:${CONTATO_PRIVACIDADE}`}
              className="text-primary hover:underline"
            >
              {CONTATO_PRIVACIDADE}
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}

