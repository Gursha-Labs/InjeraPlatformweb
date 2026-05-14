import { deposit, getWalletBalance } from '@/api/wallet'
import { Button } from '@/components/ui/button'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdvertiserWallet() {
    const { data: wallet } = useQuery({
        queryKey: ["getWalletBalance"],
        queryFn: getWalletBalance,
    })

    const [amount, setAmount] = useState<number>()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phone, setPhone] = useState("")

    const { mutate, isPending } = useMutation({
        mutationFn: deposit,
        mutationKey: ["deposit"],
        onSuccess: (data) => {
            const checkoutUrl = data?.data?.checkout_url;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                toast.error("Failed to get payment link");
            }
        },
        onError: (error: any) => {
            toast.error(error.message);
        }
    });

    const handleDeposit = () => {
        if (!amount || !firstName || !lastName || !phone) {
            toast.error("All fields are required")
            return
        }

        mutate({
            amount,
            first_name: firstName,
            last_name: lastName,
            phone
        });
    };

    return (
        <div className="flex justify-between items-center gap-2">
            <div className="text-sm font-medium px-3 py-2 rounded-lg border bg-muted">
                Balance: <span className="font-semibold">{wallet?.data?.balance ?? 0} ETB</span>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" className="px-4">Deposit</Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Deposit Funds
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-2">

                        {/* Name Row */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label>First Name</Label>
                                <Input
                                    placeholder="Naol"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <Label>Last Name</Label>
                                <Input
                                    placeholder="Meseret"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <Label>Phone Number</Label>
                            <Input
                                placeholder="09XXXXXXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <Label>Amount (ETB)</Label>
                            <Input
                                type="number"
                                placeholder="100"
                                value={amount || ""}
                                onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>

                        {/* CTA */}
                        <Button
                            onClick={handleDeposit}
                            disabled={isPending}
                            className="w-full mt-2"
                        >
                            {isPending ? "Redirecting..." : "Continue to Payment"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}