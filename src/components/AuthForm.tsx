"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { Loader2, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
import PlaidLink from "./PlaidLink";

const formSchema = z.object({
    email: z.string().email(),

})


export default function AuthForm({ type }: { type: string }) {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const formSchema = authFormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {

            //SIGN UP WITH APPWRITE & CREATE A PLAID LINK TOKEN
            if (type === 'sign-up') {
                const userData = {
                    firstName: data.firstName!,
                    lastName: data.lastName!,
                    address1: data.address1!,
                    city: data.city!,
                    state: data.state!,
                    postalCode: data.postalCode!,
                    dateOfBirth: data.dateOfBirth!,
                    ssn: data.ssn!,
                    email: data.email,
                    password: data.password
                }
                const newUser: any = await signUp(userData)
                setUser(newUser)
            }
            if (type === 'sign-in') {
                const response = await signIn({
                    email: data.email,
                    password: data.password
                })
                if (response) router.push('/')


            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <section className="auth-form">
            <header className="flex flex-col gap-5 md:gap-8">
                <Link href="/" className="cursor-pointer flex items-center gap-1 px-4">
                    <Image
                        src="/icons/finlogo2.png"
                        width={84}
                        height={34}
                        alt="Horizon logo"
                    />
                   
                </Link>
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold 
                    text-gray-900">
                        {user ?
                            'Link Account' :
                            type === 'sign-in' ? 'Sign In' : 'Sign Up'
                        }
                        <p className="text-16 font-normal text-gray-600">
                            {user ? 'Link your account to get started' :
                                'Please enter your details'
                            }
                        </p>
                    </h1>
                </div>
            </header>
            {user ? (
                <div className="flex flex-col gap-4 ">
                    <PlaidLink user={user} variant="primary" />
                </div>
            ) : (
                <>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {type === 'sign-up' && (
                                <>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="firstName"
                                            placeholder="Enter your first name"
                                            label="First Name"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="lastName"
                                            placeholder="Enter your last name"
                                            label="Last Name"
                                        />
                                    </div>
                                    <CustomInput
                                        control={form.control}
                                        name="address1"
                                        placeholder="Enter your specific address"
                                        label="Address"
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        placeholder="Enter your specific city"
                                        label="City"
                                    />
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="state"
                                            placeholder="Example:NY"
                                            label="State"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="postalCode"
                                            placeholder="Example:11101"
                                            label="Postal Code"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <CustomInput
                                            control={form.control}
                                            name="dateOfBirth"
                                            placeholder="YYYY-MM-DD"
                                            label="Date of Birth"
                                        />
                                        <CustomInput
                                            control={form.control}
                                            name="ssn"
                                            placeholder="Example:1234"
                                            label="SSN"
                                        />
                                    </div>
                                </>
                            )}

                            <CustomInput
                                control={form.control}
                                name="email"
                                placeholder="Enter your email"
                                label="Email"
                            />
                            <CustomInput
                                control={form.control}
                                name="password"
                                placeholder="Enter your password"
                                label="Password"

                            />
                            <div className="flex flex-col gap-4">
                                <Button
                                    disabled={isLoading}
                                    type="submit"
                                    className="form-btn"

                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={20}
                                                className="animate-spin"
                                            /> &nbsp;
                                            Loading...
                                        </>
                                    ) :
                                        type === 'sign-in' ?
                                            'Sign In' : 'Sign Up'

                                    }
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <footer className="flex justify-center gap-1">
                        <p className="text-14 font-normal
                        text-gray-600">
                            {type === 'sign-in' ?
                                "Don't have an account?" :
                                "Already have an account"
                            }
                        </p>
                        <Link
                            href={type === 'sign-in' ?
                                '/sign-up' : '/sign-in'
                            }
                            className="form-link"
                        >
                            {type === 'sign-in' ?
                                'Sign up' : 'Sign in'
                            }
                        </Link>
                    </footer>
                </>
            )}
        </section>
    )
}