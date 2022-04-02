/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { mocked } from "ts-jest/utils"
import { useSession } from "next-auth/client"
import { useRouter } from "next/router"
import ButtonSubscribe from "."

jest.mock("next-auth/client")
jest.mock("next/router")

describe("Button Subscribe Component", () => {
   afterEach(cleanup)
   // Teste se o componente esta renderizando normalmente
   it("render button subscribe", () => {
      const useSessionMocked = mocked(useSession)
      useSessionMocked.mockReturnValueOnce([null, false])
      render(<ButtonSubscribe />)
      expect(screen.getByText("Inscreva-se")).toBeInTheDocument()
   })

   // Teste de redirecionamento caso esteja logado
   it("redirect to posts page if you have an active subscription", () => {
      const pushMock = jest.fn()
      const useSessionMocked = mocked(useSession)
      const useRouterMocked = mocked(useRouter)
      useRouterMocked.mockReturnValueOnce({
         push: pushMock
      } as any)
      useSessionMocked.mockReturnValueOnce([
         {
            activeSubscription: "fake-activeSubscription",
            user: {
               name: "John Doe"
            },
            expires: "fake-expire"
         },
         false
      ])
      render(<ButtonSubscribe />)
      const subscribeButtonIsClicked = screen.getByText("Inscreva-se")
      fireEvent.click(subscribeButtonIsClicked)

      expect(pushMock).toHaveBeenCalledWith("/posts")
   })
   // Teste de mensagem caso usuario não esteja logado
   it("show the Message to user loggin", async () => {
      const pushMock = jest.fn()
      const useSessionMocked = mocked(useSession)
      useSessionMocked.mockReturnValueOnce([null, false])
      const useRouterMocked = mocked(useRouter)
      useRouterMocked.mockReturnValueOnce({
         push: pushMock
      } as any)
      render(<ButtonSubscribe />)
      fireEvent.click(screen.getByText(/Inscreva-se/i))

      expect(pushMock).toHaveBeenCalledWith("/")
   })
})
