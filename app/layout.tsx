import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'DealHunter — Good food. Better deals.',description:'Compare food and drink promotions across Malaysia, save your favourites and track your savings.',icons:{icon:'/favicon.svg'},manifest:'/manifest.webmanifest'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
