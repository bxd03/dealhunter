import App from '../ui';
import {requireChatGPTUser} from '../chatgpt-auth';
export const dynamic='force-dynamic';
export default async function DashboardPage(){await requireChatGPTUser('/dashboard');return <App/>}
