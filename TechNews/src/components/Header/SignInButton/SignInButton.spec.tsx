/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react"
import { useSession } from "next-auth/client"
import { mocked } from "ts-jest/utils"
import SignInButton from "."

jest.mock("next/image", () => ({
   //eslint-disable
   __esModule: true,
   default: (props: any) => {
      return <img {...props} />
   }
}))
jest.mock("next-auth/client")

describe("SignInButton renders", () => {
   const useSessioMocked = mocked(useSession, true)
   it("have the user login buttons", () => {
      useSessioMocked.mockReturnValueOnce([null, false])
      render(<SignInButton />)

      expect(screen.getByTestId("signInWithGitHub")).toBeInTheDocument()
      expect(screen.getByTestId("signInWithGoogle")).toBeInTheDocument()
   })

   it("have the user data logged in", () => {
      useSessioMocked.mockReturnValueOnce([
         {
            user: {
               name: "John Doe"
            },
            expires: "fake-expire"
         },
         false
      ])
      render(<SignInButton />)

      expect(screen.getByText("John Doe")).toBeInTheDocument()
   })
})
