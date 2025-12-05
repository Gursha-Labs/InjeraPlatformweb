import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/hook'
import { logout } from '@/store/slices/authSlice'

export default function Setting() {
    const dispatch = useAppDispatch()
    const handleLogout = () => {
        dispatch(logout())
    }
    return (
        <div>

            <Button variant="destructive" onClick={handleLogout}>
                Log Out
            </Button>

        </div >
    )
}
