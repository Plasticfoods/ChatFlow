import Menu from "./Menu"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"
import { useState, useEffect } from "react";
import Loader from "./Loader";

export default function Home() {
    const [activeChatId, setActiveChatId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000); // Show loader for 2 seconds

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <Loader message="Loading Chats..." overlay={true} />;
    }

    return (
        <div className="home" style={{ position: 'relative' }}>
            <Menu />
            <ChatList activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
            <ChatWindow activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
        </div>
    )
}
