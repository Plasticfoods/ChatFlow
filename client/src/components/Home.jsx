import Menu from "./Menu"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"
import { useState } from "react";

export default function Home() {
    const [activeChatId, setActiveChatId] = useState(null);

    return (
        <div className="home">
            <Menu />
            <ChatList activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
            <ChatWindow activeChatId={activeChatId} setActiveChatId={setActiveChatId} />
        </div>
    )
}
