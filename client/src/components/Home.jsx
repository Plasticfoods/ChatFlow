import Menu from "./Menu"
import ChatList from "./ChatList"
import ChatWindow from "./ChatWindow"

export default function Home() {

    return (
        <div className="home">
            <Menu />
            <ChatList />
            <ChatWindow />
        </div>
    )
}
