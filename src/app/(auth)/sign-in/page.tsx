import AuthForm from "@/components/AuthForm";

export default function SignIn(){
    return(
        <section className="signin flex-center size-full max-sm:px-6">
            <AuthForm  type="sign-in"/>
        </section>
    )
}