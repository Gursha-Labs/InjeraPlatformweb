import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/api/auth"
import { useState } from "react"
import { toast } from "sonner"

export default function Signup() {
    const navigate = useNavigate()
    const [registerform, setRegisterform] = useState({
        username: "",
        email: "",
        password: ""
    })
    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        mutationKey: ["registerUser"],
        onSuccess: (data) => {
            localStorage.setItem("token", data.token)
            toast.success("Registerd sucessfuly ")
            navigate("/user-profile-build")
        },
        onError: (err) => {
            console.log(err)
            toast.error(err.message)
        }
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setRegisterform(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!registerform.username || !registerform.email || !registerform.password) return
        mutate(registerform)
    }
    return (
        <div className=" flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">

                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <Link to="/" className="flex items-center gap-2 self-center font-medium">
                            Injera
                        </Link>
                        <CardHeader className="text-center">

                            <CardTitle className="text-xl">Create your account</CardTitle>
                            <CardDescription>
                                Enter your Information below to create your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">User Name</FieldLabel>
                                        <Input id="name" type="text" placeholder="abebe123" required value={registerform.username} onChange={handleChange} />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={registerform.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <Field className="grid grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                                <Input id="password" type="password" required value={registerform.password} onChange={handleChange} />
                                            </Field>
                                            <Field>
                                                <FieldLabel htmlFor="confirm-password">
                                                    Confirm Password
                                                </FieldLabel>
                                                <Input id="confirm-password" type="password" required />
                                            </Field>
                                        </Field>
                                        <FieldDescription>
                                            Must be at least 8 characters long.
                                        </FieldDescription>
                                    </Field>
                                    <Field>
                                        <Button type="submit" disabled={isPending} >Create Account</Button>
                                        <FieldDescription className="text-center">
                                            Already have an account? <Link to="/login">Sign in</Link>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </div>
    )
}
