import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Definindo as rotas públicas
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/webhook', '/']);  // Inclua a rota "/" para a homepage

export default clerkMiddleware(async (auth, request) => {
  console.log('Verificando rota:', request.url);  // Exibe a URL da rota sendo acessada
  if (!isPublicRoute(request)) {
    console.log('Rota privada, protegendo...');
    await auth.protect();  // Protege as rotas privadas
  } else {
    console.log('Rota pública, liberada.');
  }
});

// Configuração do matcher para garantir que o middleware seja aplicado nas rotas corretas
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',  // Rota de API e TRPC também protegidas
  ],
};
