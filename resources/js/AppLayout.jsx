import { usePage } from '@inertiajs/react';
import Navbar from '../Components/Navbar';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    
    return (
        <div>
            <Navbar auth={auth} />
            <main>{children}</main>
        </div>
    );
}