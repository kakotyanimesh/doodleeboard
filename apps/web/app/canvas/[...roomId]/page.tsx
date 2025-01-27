import MainCanvas from "../../components/mainacanvas"
import ProxyCanvas from "../../components/proxyCanvas"

export default async function CanvasPage({params}: {
    params : {
        roomId : string
    }
}) {

    const roomId = (await params).roomId
    return <div>
        <ProxyCanvas roomId={roomId}/>
    </div>
}