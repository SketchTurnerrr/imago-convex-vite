// import { SignInFormAnonymous } from "@/auth/SignInFormAnonymous";
import { SignInFormEmailLink } from "@/auth/SignInFormEmailLink";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This component is here to showcase different combinations of sign-in methods.
// 1. Choose one of the forms and use it directly instead of this component.
// 2. Delete or add OAuth providers as needed.
// 3. Delete the unused forms.
export function SignInFormsShowcase() {
  return (
    <Tabs defaultValue="otp" className="container flex flex-col mt-10">
      <TabsList className="justify-start max-w-full mb-1 ml-auto mr-10 overflow-x-scroll opacity-60">
        <TabsTrigger value="otp">OTP</TabsTrigger>
        <TabsTrigger value="link">Magic Link</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        {/* <TabsTrigger value="anonymous">Anonymous</TabsTrigger> */}
      </TabsList>
      <TabsContent value="otp">
        <Tabs defaultValue="email" className="flex flex-col">
          <TabsList className="ml-auto mr-10 mb-7 opacity-60">
            <TabsTrigger value="email">OAuth + Email</TabsTrigger>
            <TabsTrigger value="phone">SMS</TabsTrigger>
          </TabsList>
        </Tabs>
      </TabsContent>
      <TabsContent className="mt-20" value="link">
        {/* Sign in via magic link */}
        <SignInFormEmailLink />
      </TabsContent>
      <TabsContent value="password">
        <Tabs defaultValue="basic" className="flex flex-col">
          <TabsList className="justify-start max-w-full ml-auto mr-10 overflow-x-scroll mb-7 opacity-60">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="password reset">Password Reset</TabsTrigger>
            <TabsTrigger value="email verification">
              OAuth + Email Verification
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </TabsContent>
      {/* Sign in anonymously */}
      {/* <TabsContent className="mt-20" value="anonymous">
        <SignInFormAnonymous />
      </TabsContent> */}
    </Tabs>
  );
}
