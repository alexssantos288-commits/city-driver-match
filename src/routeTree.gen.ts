/* eslint-disable */

// @ts-nocheck

// This file is generated from the file-based routes.
// Keep it stable for the Lovable/TanStack preview.

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthenticatedRouteRouteImport } from './routes/_authenticated/route'
import { Route as AuthenticatedNotificacoesRouteImport } from './routes/_authenticated/notificacoes'
import { Route as AuthenticatedPainelMotoristaRouteImport } from './routes/_authenticated/painel-motorista'
import { Route as AuthenticatedPainelMotoristaCadastroRouteImport } from './routes/_authenticated/painel-motorista/cadastro'
import { Route as AuthenticatedPainelMotoristaVeiculoRouteImport } from './routes/_authenticated/painel-motorista/veiculo'
import { Route as AuthenticatedPassageiroRouteImport } from './routes/_authenticated/passageiro'
import { Route as AuthenticatedPassageiroViagensRouteImport } from './routes/_authenticated/passageiro/viagens'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as CadastroRouteImport } from './routes/cadastro'
import { Route as EntrarRouteImport } from './routes/entrar'
import { Route as MotoristaIdRouteImport } from './routes/motorista/$id'
import { Route as MotoristasRouteImport } from './routes/motoristas'
import { Route as RecuperarSenhaRouteImport } from './routes/recuperar-senha'
import { Route as ResetPasswordRouteImport } from './routes/reset-password'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

const AuthenticatedRouteRoute = AuthenticatedRouteRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRouteImport,
} as any)

const AdminRoute = AdminRouteImport.update({
  id: '/admin',
  path: '/admin',
  getParentRoute: () => rootRouteImport,
} as any)

const CadastroRoute = CadastroRouteImport.update({
  id: '/cadastro',
  path: '/cadastro',
  getParentRoute: () => rootRouteImport,
} as any)

const EntrarRoute = EntrarRouteImport.update({
  id: '/entrar',
  path: '/entrar',
  getParentRoute: () => rootRouteImport,
} as any)

const MotoristaIdRoute = MotoristaIdRouteImport.update({
  id: '/motorista/$id',
  path: '/motorista/$id',
  getParentRoute: () => rootRouteImport,
} as any)

const MotoristasRoute = MotoristasRouteImport.update({
  id: '/motoristas',
  path: '/motoristas',
  getParentRoute: () => rootRouteImport,
} as any)

const RecuperarSenhaRoute = RecuperarSenhaRouteImport.update({
  id: '/recuperar-senha',
  path: '/recuperar-senha',
  getParentRoute: () => rootRouteImport,
} as any)

const ResetPasswordRoute = ResetPasswordRouteImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => rootRouteImport,
} as any)

const AuthenticatedNotificacoesRoute = AuthenticatedNotificacoesRouteImport.update({
  id: '/notificacoes',
  path: '/notificacoes',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedPainelMotoristaRoute = AuthenticatedPainelMotoristaRouteImport.update({
  id: '/painel-motorista',
  path: '/painel-motorista',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedPainelMotoristaCadastroRoute = AuthenticatedPainelMotoristaCadastroRouteImport.update({
  id: '/painel-motorista/cadastro',
  path: '/painel-motorista/cadastro',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedPainelMotoristaVeiculoRoute = AuthenticatedPainelMotoristaVeiculoRouteImport.update({
  id: '/painel-motorista/veiculo',
  path: '/painel-motorista/veiculo',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedPassageiroRoute = AuthenticatedPassageiroRouteImport.update({
  id: '/passageiro',
  path: '/passageiro',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const AuthenticatedPassageiroViagensRoute = AuthenticatedPassageiroViagensRouteImport.update({
  id: '/passageiro/viagens',
  path: '/passageiro/viagens',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/admin': typeof AdminRoute
  '/cadastro': typeof CadastroRoute
  '/entrar': typeof EntrarRoute
  '/motorista/$id': typeof MotoristaIdRoute
  '/motoristas': typeof MotoristasRoute
  '/recuperar-senha': typeof RecuperarSenhaRoute
  '/reset-password': typeof ResetPasswordRoute
  '/notificacoes': typeof AuthenticatedNotificacoesRoute
  '/painel-motorista': typeof AuthenticatedPainelMotoristaRoute
  '/painel-motorista/cadastro': typeof AuthenticatedPainelMotoristaCadastroRoute
  '/painel-motorista/veiculo': typeof AuthenticatedPainelMotoristaVeiculoRoute
  '/passageiro': typeof AuthenticatedPassageiroRoute
  '/passageiro/viagens': typeof AuthenticatedPassageiroViagensRoute
}

export interface FileRoutesByTo extends FileRoutesByFullPath {}

export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/admin': typeof AdminRoute
  '/cadastro': typeof CadastroRoute
  '/entrar': typeof EntrarRoute
  '/motorista/$id': typeof MotoristaIdRoute
  '/motoristas': typeof MotoristasRoute
  '/recuperar-senha': typeof RecuperarSenhaRoute
  '/reset-password': typeof ResetPasswordRoute
  '/_authenticated/notificacoes': typeof AuthenticatedNotificacoesRoute
  '/_authenticated/painel-motorista': typeof AuthenticatedPainelMotoristaRoute
  '/_authenticated/painel-motorista/cadastro': typeof AuthenticatedPainelMotoristaCadastroRoute
  '/_authenticated/painel-motorista/veiculo': typeof AuthenticatedPainelMotoristaVeiculoRoute
  '/_authenticated/passageiro': typeof AuthenticatedPassageiroRoute
  '/_authenticated/passageiro/viagens': typeof AuthenticatedPassageiroViagensRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: keyof FileRoutesByFullPath
  fileRoutesByTo: FileRoutesByTo
  to: keyof FileRoutesByTo
  id: keyof FileRoutesById
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AdminRoute: typeof AdminRoute
  CadastroRoute: typeof CadastroRoute
  EntrarRoute: typeof EntrarRoute
  MotoristaIdRoute: typeof MotoristaIdRoute
  MotoristasRoute: typeof MotoristasRoute
  RecuperarSenhaRoute: typeof RecuperarSenhaRoute
  ResetPasswordRoute: typeof ResetPasswordRoute
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
}

export interface AuthenticatedRouteRouteChildren {
  AuthenticatedNotificacoesRoute: typeof AuthenticatedNotificacoesRoute
  AuthenticatedPainelMotoristaRoute: typeof AuthenticatedPainelMotoristaRoute
  AuthenticatedPainelMotoristaCadastroRoute: typeof AuthenticatedPainelMotoristaCadastroRoute
  AuthenticatedPainelMotoristaVeiculoRoute: typeof AuthenticatedPainelMotoristaVeiculoRoute
  AuthenticatedPassageiroRoute: typeof AuthenticatedPassageiroRoute
  AuthenticatedPassageiroViagensRoute: typeof AuthenticatedPassageiroViagensRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedNotificacoesRoute,
  AuthenticatedPainelMotoristaRoute,
  AuthenticatedPainelMotoristaCadastroRoute,
  AuthenticatedPainelMotoristaVeiculoRoute,
  AuthenticatedPassageiroRoute,
  AuthenticatedPassageiroViagensRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  AdminRoute,
  CadastroRoute,
  EntrarRoute,
  MotoristaIdRoute,
  MotoristasRoute,
  RecuperarSenhaRoute,
  ResetPasswordRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedRouteRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/cadastro': {
      id: '/cadastro'
      path: '/cadastro'
      fullPath: '/cadastro'
      preLoaderRoute: typeof CadastroRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/entrar': {
      id: '/entrar'
      path: '/entrar'
      fullPath: '/entrar'
      preLoaderRoute: typeof EntrarRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/motorista/$id': {
      id: '/motorista/$id'
      path: '/motorista/$id'
      fullPath: '/motorista/$id'
      preLoaderRoute: typeof MotoristaIdRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/motoristas': {
      id: '/motoristas'
      path: '/motoristas'
      fullPath: '/motoristas'
      preLoaderRoute: typeof MotoristasRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/recuperar-senha': {
      id: '/recuperar-senha'
      path: '/recuperar-senha'
      fullPath: '/recuperar-senha'
      preLoaderRoute: typeof RecuperarSenhaRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/reset-password': {
      id: '/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof ResetPasswordRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_authenticated/notificacoes': {
      id: '/_authenticated/notificacoes'
      path: '/notificacoes'
      fullPath: '/notificacoes'
      preLoaderRoute: typeof AuthenticatedNotificacoesRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/painel-motorista': {
      id: '/_authenticated/painel-motorista'
      path: '/painel-motorista'
      fullPath: '/painel-motorista'
      preLoaderRoute: typeof AuthenticatedPainelMotoristaRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/painel-motorista/cadastro': {
      id: '/_authenticated/painel-motorista/cadastro'
      path: '/painel-motorista/cadastro'
      fullPath: '/painel-motorista/cadastro'
      preLoaderRoute: typeof AuthenticatedPainelMotoristaCadastroRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/painel-motorista/veiculo': {
      id: '/_authenticated/painel-motorista/veiculo'
      path: '/painel-motorista/veiculo'
      fullPath: '/painel-motorista/veiculo'
      preLoaderRoute: typeof AuthenticatedPainelMotoristaVeiculoRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/passageiro': {
      id: '/_authenticated/passageiro'
      path: '/passageiro'
      fullPath: '/passageiro'
      preLoaderRoute: typeof AuthenticatedPassageiroRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
    '/_authenticated/passageiro/viagens': {
      id: '/_authenticated/passageiro/viagens'
      path: '/passageiro/viagens'
      fullPath: '/passageiro/viagens'
      preLoaderRoute: typeof AuthenticatedPassageiroViagensRouteImport
      parentRoute: typeof AuthenticatedRouteRoute
    }
  }
}

declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
    config: Awaited<ReturnType<typeof startInstance.getOptions>>
  }
}
