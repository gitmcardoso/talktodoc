'use client'; // Marca este componente como um Client Component

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LogIn, FileText, MessageSquare, Bookmark, Clipboard, ArrowRight } from 'lucide-react';
import FileUpload from "@/components/FileUpload";
import { useEffect, useState } from 'react';
import { FaComment, FaGraduationCap, FaBriefcase, FaHeartbeat, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { FaBars, FaTimes } from 'react-icons/fa';
import SubscriptionButton from "@/components/SubscriptionButton";

// Defina a interface para o objeto "chat"
interface Chat {
  id: number;
  userId: string;
  pdfName: string;
  pdfUrl: string;
  createdAt: Date;
  fileKey: string;
}

export default function Home() {
  const { user, isLoaded } = useUser();
  const isAuth = !!user?.id;
  const [isPro, setIsPro] = useState(false);
  const [firstChat, setFirstChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        // Verifica a assinatura do usuário
        const subscriptionResponse = await fetch('/api/check');
        const subscriptionData = await subscriptionResponse.json();
        setIsPro(subscriptionData.isPro);
        // Busca o primeiro chat do usuário
        const chatResponse = await fetch('/api/first-chat');
        const chatData = await chatResponse.json();
        setFirstChat(chatData.firstChat);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user]);


  useEffect(() => {
    const fetchFirstChat = async () => {
      try {
        const response = await fetch('/api/first-chat');
        if (!response.ok) {
          throw new Error("Erro ao buscar o primeiro chat");
        }
        const data = await response.json();
        console.log("Resposta da API /api/first-chat:", data);
        setFirstChat(data.firstChat);
      } catch (error) {
        console.error("Erro ao buscar o primeiro chat:", error);
        setFirstChat(null);
      }
    };
  
    if (isAuth) {
      fetchFirstChat();
    }
  }, [isAuth]);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Controla se estamos em um dispositivo móvel




  // Detecta a largura da tela

  // Detecta a largura da tela
  // Detecta a largura da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Muda para 'true' quando a largura da tela for menor que 768px
    };

    handleResize(); // Chama inicialmente para configurar o estado
    window.addEventListener('resize', handleResize); // Adiciona o listener de resize
    return () => window.removeEventListener('resize', handleResize); // Limpeza ao desmontar
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Traduções diretamente no arquivo
  const translations = {
    'pt-BR': {
      welcome: 'Chat com qualquer PDF',
      go_to_chats: 'Ir para os Chats',
      description: 'Junte-se a milhões de estudantes, pesquisadores e profissionais para responder instantaneamente perguntas e entender pesquisas com IA',
      login_to_get_started: 'Faça login para começar!',
      importance_title: 'Por que o Chat com PDF é importante?',
      importance_description:
        'O Talk To Doc facilita a compreensão de documentos complexos e ajuda em trabalhos acadêmicos e profissionais de forma rápida e eficaz.',
      importance_points: [
        { icon: <FileText />, title: 'Acesso rápido à informação', description: 'Encontre rapidamente as respostas que você precisa em PDFs extensos.' },
        { icon: <Bookmark />, title: 'Pesquisas eficientes', description: 'Realize pesquisas mais inteligentes sem ter que abrir manualmente cada seção do documento.' },
        { icon: <Clipboard />, title: 'Trabalho acadêmico facilitado', description: 'Acelere seus estudos com a leitura e análise de textos mais rápidos e precisos.' },
        { icon: <MessageSquare />, title: 'Interação fácil', description: 'Converse diretamente com o conteúdo do PDF para tirar dúvidas e esclarecer informações.' }
      ],
      testimonials: [
        {
          name: 'João Silva',
          profession: 'Estudante de Medicina',
          content: 'O TalkToDoc transformou a maneira como estudo, especialmente para revisar artigos médicos. A interação é rápida e precisa.',
          iconColor: 'text-red-500', // Definindo cor personalizada para cada depoimento
        },
        {
          name: 'Ana Pereira',
          profession: 'Pesquisadora',
          content: 'Usar o Chat com PDF tornou minha pesquisa muito mais eficiente. Eu consigo encontrar informações relevantes em segundos.',
          iconColor: 'text-blue-500',
        },
        {
          name: 'Carlos Oliveira',
          profession: 'Advogado',
          content: 'Agora posso revisar contratos e documentos legais com muito mais agilidade. A IA realmente entende o conteúdo dos PDFs.',
          iconColor: 'text-green-500',
        }
      ],
      faq: [
        { question: "Como faço para começar a usar?", answer: "Basta fazer login e carregar seu PDF para começar a interagir com ele." },
        { question: "O serviço é gratuito?", answer: "Oferecemos um plano gratuito, mas também temos o plano pago para funcionalidades adicionais." },
        { question: "Como posso cancelar minha assinatura?", answer: "Você pode cancelar sua assinatura a qualquer momento na seção de Gerenciar Assinatura da sua conta." },
        { question: "Como o Chat com PDF funciona?", answer: "O sistema utiliza IA para responder perguntas baseadas no conteúdo do PDF que você fornece." }
      ],
      plans: {
        free: {
          title: "Padrão",
          price: "Grátis",
          features: ["Interação com 1 PDF por vez", "Limite de perguntas por mês", "Suporte prioritário", "Armazenamento de PDFs ilimitado"]
        },
        paid: {
          title: "Pro",
          price: "R$ 39,99/mês",
          features: ["Interação ilimitada com PDFs ", "Acesso completo aos recursos avançados", "Suporte prioritário", "Armazenamento de PDFs ilimitado"]
        }
      }
    },
    en: {
      welcome: 'Chat with any ',
      go_to_chats: 'Go to Chats',
      description: 'Join millions of students, researchers, and professionals to instantly answer questions and understand research with AI',
      login_to_get_started: 'Login to get Started!',
      importance_title: 'Why is Chat with PDF Important?',
      importance_description:
        'Chat with PDF helps in understanding complex documents and aids in academic and professional work quickly and effectively.',
      importance_points: [
        { icon: <FileText />, title: 'Quick access to information', description: 'Find the answers you need quickly in lengthy PDFs.' },
        { icon: <Bookmark />, title: 'Efficient research', description: 'Conduct smarter searches without opening each section of the document manually.' },
        { icon: <Clipboard />, title: 'Simplified academic work', description: 'Speed up your studies with faster and more precise reading and analysis of texts.' },
        { icon: <MessageSquare />, title: 'Easy interaction', description: 'Interact directly with the content of the PDF to clear doubts and clarify information.' }
      ],
      testimonials: [
        {
          name: 'John Silva',
          profession: 'Medical Student',
          content: 'Chat with PDF has completely transformed the way I study, especially for reviewing medical papers. The interaction is quick and accurate.',
          iconColor: 'text-red-500',
        },
        {
          name: 'Ana Pereira',
          profession: 'Researcher',
          content: 'Using Chat with PDF made my research way more efficient. I can find relevant information in seconds.',
          iconColor: 'text-blue-500',
        },
        {
          name: 'Carlos Oliveira',
          profession: 'Lawyer',
          content: 'Now I can review contracts and legal documents much more quickly. The AI truly understands the content of PDFs.',
          iconColor: 'text-green-500',
        }
      ],
      faq: [
        { question: "How do I get started?", answer: "Simply log in and upload your PDF to start interacting with it." },
        { question: "Is the service free?", answer: "We offer a free plan, but also have a paid plan for additional features." },
        { question: "How can I cancel my subscription?", answer: "You can cancel your subscription anytime from your account settings." },
        { question: "How does Chat with PDF work?", answer: "The system uses AI to answer questions based on the content of the PDF you upload." }
      ],
      plans: {
        free: {
          title: "Free Plan",
          price: "Free",
          features: ["Interact with 1 PDF at a time", "100 questions per month limit", "Access to basic features"]
        },
        paid: {
          title: "Paid Plan",
          price: "$7,99/month",
          features: ["Unlimited PDF interactions", "Full access to advanced features", "Priority support", "Unlimited PDF storage"]
        }
      }
    }
  };

  const [language, setLanguage] = useState<'pt-BR' | 'en'>('pt-BR');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0); // Controle do índice do depoimento

  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage');
    if (storedLang && (storedLang === 'pt-BR' || storedLang === 'en')) {
      setLanguage(storedLang as 'pt-BR' | 'en');
    } else {
      const defaultLang = 'pt-BR';
      localStorage.setItem('preferredLanguage', defaultLang);
      setLanguage(defaultLang);
    }
    
  }, []);

  const handleLanguageChange = (lang: 'pt-BR' | 'en') => {
    localStorage.setItem('preferredLanguage', lang);
    setLanguage(lang);
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % t.testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prevIndex) =>
      prevIndex === 0 ? t.testimonials.length - 1 : prevIndex - 1
    );
  };

  if (!isLoaded) {
    return null;
  }

  const t = translations[language];

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A]" style={{ colorScheme: 'dark' }}>
      {/* Menu Superior */}
      <div className="flex items-center justify-between p-4 bg-transparent fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
        {/* Ícone do Menu Hamburguer (apenas no celular) */}
        {isMobile ? (
          <button onClick={toggleMobileMenu} className="text-white md:hidden">
            {isMobileMenuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
          </button>
        ) : null}

        {/* Nome "TalkToDoc" (alinhado à esquerda no celular, ao centro no desktop) */}
        <div className={`text-white font-semibold text-lg ${isMobile ? 'ml-4' : 'mx-auto'} md:text-2xl text-center`}>
          TalkToDoc
        </div>

        {/* Menu de Navegação (apenas no desktop) */}
        {!isMobile && (
          <div className="flex items-center justify-center flex-grow gap-10 ml-4 md:ml-20 lg:ml-32">
            <a href="#home" className="text-white font-medium text-sm hover:text-red-500 transition-all duration-300">Home</a>
            <a href="#pricing" className="text-white font-medium text-sm hover:text-red-500 transition-all duration-300">Pricing</a>
            <a href="#collaborators" className="text-white font-medium text-sm hover:text-red-500 transition-all duration-300">Collaborators</a>
          </div>
        )}

        {/* Seletor de Idioma e Conta do Usuário (apenas no desktop) */}
        {!isMobile && (
          <>
            <div className="mr-4">
              <select
                onChange={(e) => handleLanguageChange(e.target.value as 'pt-BR' | 'en')}
                value={language}
                className="bg-[#0A0A0A] border border-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm transition-all duration-300 shadow-lg"
              >
                <option value="pt-BR">Português</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex items-center gap-4 border border-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-2 hover:bg-gray-700 transition-all duration-300">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <UserButton afterSignOutUrl="/" />
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-blue-900 rounded-full"></span>
                  </div>
                  <div className="text-white font-medium text-sm">
                    <span className="block">Bem-vindo, {user.firstName}</span>
                    <span className="text-xs">Conta</span>
                  </div>
                </div>
              ) : (
                <Link href='/sign-in'>
                <Button className="transition-all duration-300 transform hover:scale-105  hover:bg-transparent text-white bg-transparent  font-semibold py-2 px-4 rounded-md shadow-lg hover:shadow-xl   text-sm">
                  Login
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              )}
            </div>
          </>
        )}
      </div>

      {/* Menu Hamburguer (apenas no celular) */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-[#0A0A0A] z-40 flex flex-col items-start p-6 space-y-6">
          <button onClick={toggleMobileMenu} className="text-white self-end">
            <FaTimes size={30} />
          </button>

          {/* Opções do Menu dentro do painel lateral */}
          <div className="flex flex-col items-start space-y-4">
            <a href="#home" className="text-white font-medium text-lg">Home</a>
            <a href="#pricing" className="text-white font-medium text-lg">Pricing</a>
            <a href="#collaborators" className="text-white font-medium text-lg">Collaborators</a>
          </div>

          {/* Seletor de Idioma */}
          <div className="mt-4">
            <select
              onChange={(e) => handleLanguageChange(e.target.value as 'pt-BR' | 'en')}
              value={language}
              className="bg-[#0A0A0A] border border-gradient-to-r from-purple-600 to-blue-500 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
            >
              <option value="pt-BR">Português</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Conta do Usuário */}
          <div className="flex items-center gap-4 mt-6 border border-gradient-to-r from-purple-600 to-blue-500 rounded-lg p-2 hover:bg-gray-700 transition-all duration-300">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <UserButton afterSignOutUrl="/" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-blue-900 rounded-full"></span>
                </div>
                <div className="text-white font-medium text-sm">
                  <span className="block">Bem-vindo, {user.firstName}</span>
                  <span className="text-xs">Conta</span>
                </div>
              </div>
            ) : (
              <Link href='/sign-in'>
              <Button className="transition-all duration-300 transform hover:scale-105 hover:bg-white text-black bg-white border border-white font-semibold py-2 px-4 rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                Login
                <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            )}
          </div>
        </div>
      )}
      );


      {/* Seção Principal */}
      <div className="p-11 md:p-32 lg:p-72 text-center" id="home">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold">
          <span className="text-[#EDEDED]">
            {t.welcome.replace('PDF', '')}
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient-x">
            PDF
          </span>
        </h1>

        <div className="flex justify-center mt-7">
          {isAuth && firstChat && 
          <Link  href={`/chat/${firstChat.id}`}>
          <Button className="w-full bg-transparent border text-white border-x-white hover:bg-white hover:text-black transition-all duration-300 py-2">
            Ir Para Os Chats <ArrowRight className="ml-2" />
          </Button>
          </Link>
          
          }
          {isAuth &&
          <div className="ml-3"><SubscriptionButton isPro={isPro} /></div>
        }
          </div>
          

        <p className="max-w-xl mx-auto mt-9 text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#EDEDED]">
          {t.description}
        </p>

        <div className="mt-10">
          {isAuth ? (
            <div className="flex justify-center">
              {/* Aumentando a largura para 900px e a altura para 500px em telas grandes */}
              <div className="w-[800px] h-[450px]">
                <FileUpload />
              </div>
            </div>
          ) : (
            <Link href='/sign-in'>
              <Button className="transition-all duration-300 transform hover:scale-105 hover:bg-white text-black bg-white border border-white font-semibold py-2 px-4 rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                {t.login_to_get_started}
                <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </div>


      {/* Planos */}
      <h2 className="text-3xl font-semibold mt-20 text-center mb-8 text-[#EDEDED]" id="pricing">Escolha o seu Plano</h2>

      <div className="flex flex-col md:flex-row justify-center items-center md:items-stretch md:space-x-8 space-y-8 md:space-y-0">
        {/* Plano Gratuito */}
        <div className="bg-transparent text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:translate-y-2 border border-[#EDEDED] w-80 flex flex-col items-center md:items-stretch">
          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-center md:text-left text-[#EDEDED]">{t.plans.free.title}</h3>
            <p className="text-xl font-bold text-center md:text-left text-[#DC2626] mb-4">{t.plans.free.price}</p>
            <ul className="space-y-4 mb-6 text-center md:text-left text-[#EDEDED]">
              {t.plans.free.features.map((feature, index) => (
                <li key={index} className="text-lg flex items-center">
                  {feature.includes("Suporte prioritário") || feature.includes("Armazenamento de PDFs ilimitado") ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#DC2626] flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-[#4CAF50] flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="ml-2">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant="outline"
            className="w-full bg-transparent border border-[#DC2626] hover:bg-[#DC2626] hover:text-white transition-all duration-300 py-2"
          >
            Plano Padrão
          </Button>
        </div>

        {/* Plano Pago */}
        <div className="bg-transparent text-white p-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:translate-y-2 border border-[#EDEDED] w-80 flex flex-col items-center md:items-stretch">
          <div className="flex-grow">
            <h3 className="text-2xl font-semibold text-center md:text-left mb-4 flex items-center justify-center md:justify-start">
              {t.plans.paid.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#00BFFF] ml-2 transform transition-transform duration-500 group-hover:animate-spin"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </h3>
            <p className="text-xl font-bold text-center md:text-left mb-4">{t.plans.paid.price}</p>
            <ul className="space-y-4 mb-6 text-center md:text-left">
              {t.plans.paid.features.map((feature, index) => (
                <li key={index} className="text-lg flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#4CAF50] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-2">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ml-2 text-black bg-transparent"><SubscriptionButton isPro={isPro} /></div>
          </div>
      </div>


      {/* Importância do Chat com PDF */}
      <div className="bg-transparent py-32 mt-32">
        <h2 className="text-4xl font-semibold text-center mb-6 text-[#EDEDED]">{t.importance_title}</h2>
        <p className="text-lg text-center mx-auto max-w-2xl mb-8 text-[#EDEDED]">
          {t.importance_description}
        </p>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {t.importance_points.map((point, index) => (
            <div
              key={index}
              className="bg-[#121212] p-8 rounded-lg shadow-lg text-center border  border-[#EDEDED]"
            >
              <div className="text-5xl mb-6 text-[#DC2626]">
                {point.icon}
              </div>
              <h3 className="font-semibold text-2xl text-[#EDEDED] mb-3">{point.title}</h3>
              <p className="text-lg text-[#EDEDED]">{point.description}</p>
            </div>
          ))}
        </div>
      </div>



      {/* Depoimentos */}
      <div className="mt-36 max-w-4xl mx-auto p-10 border bg-[#121212] border-[#EDEDED] shadow-md rounded-lg" id="collaborators">
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#EDEDED]">O que nossos usuários dizem</h2>
        <div className="text-center">
          {/* Avatar e Ícones Profissionais */}
          <div className="flex justify-center items-center mb-4">
            <FaUserCircle className="text-6xl text-[#EDEDED]" />
          </div>
          <h3 className="font-semibold text-xl mb-2 text-[#EDEDED]">
            {t.testimonials[currentTestimonialIndex].name}
          </h3>

          {/* Corrigido: removi a div dentro do <p> */}
          <p className="text-sm text-[#EDEDED] mb-4">
            {t.testimonials[currentTestimonialIndex].profession}
          </p>

          {/* Profissões com ícones agora fora do <p> */}
          <div className="flex justify-center items-center gap-2 mb-4">
            {t.testimonials[currentTestimonialIndex].profession === 'Estudante de Medicina' && <FaHeartbeat className="text-red-500 text-xl" />}
            {t.testimonials[currentTestimonialIndex].profession === 'Pesquisadora' && <FaGraduationCap className="text-blue-500 text-xl" />}
            {t.testimonials[currentTestimonialIndex].profession === 'Advogado' && <FaBriefcase className="text-green-500 text-xl" />}
          </div>

          <p className="text-lg text-[#EDEDED] mb-6">{t.testimonials[currentTestimonialIndex].content}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={prevTestimonial} className="bg-transparent border border-[#DC2626] text-[#EDEDED] py-2 px-4 rounded-md">Anterior</Button>
            <Button onClick={nextTestimonial} className="bg-transparent border border-[#DC2626] text-[#EDEDED] py-2 px-4 rounded-md">Próximo</Button>
          </div>
        </div>
      </div>


      {/* Seção de Redes Sociais */}
      <div className="bg-transparent py-10 mt-32">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#EDEDED]">TalkToDoc</h2>
        <p className="text-lg text-center mx-auto max-w-2xl mb-8 text-[#EDEDED]">
          Siga-nos nas redes sociais!
        </p>
        <div className="flex justify-center gap-10">
          {/* Ícones das redes sociais */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDEDED] hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
          >
            <FaFacebookF className="text-4xl" />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDEDED] hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
          >
            <FaTwitter className="text-4xl" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDEDED] hover:text-pink-500 transition-all duration-300 transform hover:scale-110"
          >
            <FaInstagram className="text-4xl" />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#EDEDED] hover:text-blue-700 transition-all duration-300 transform hover:scale-110"
          >
            <FaLinkedinIn className="text-4xl" />
          </a>
        </div>
      </div>




      {/* FAQ */}
      <section className="py-56 px-10 bg-blur">
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#EDEDED]">Perguntas Frequentes</h2>
        <div className="space-y-6">
          {t.faq.map((faq, index) => (
            <div key={index} className="border-b border-[#DC2626] py-4">
              <h3 className="text-xl font-semibold text-[#EDEDED]">{faq.question}</h3>
              <p className="text-lg text-[#EDEDED]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>






      {/* Footer */}
      {/* Footer */}
      {/* Footer */}
      <footer className="w-full py-5 bg-transparent text-center text-[#EDEDED] border-t-2 border-[#1f1e1e] bg-clip-border" >
        <p>&copy; 2025 TalkToDoc. Todos os direitos reservados.</p>
      </footer>



    </div>
  );
}
