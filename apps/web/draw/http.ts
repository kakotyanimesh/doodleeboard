import axios from "axios"

export const getShapesfromBackend = async(roomId  : string ) => {
    const res = await axios.get(`http://localhost:4000/api/v1/room/shapes/${roomId}`)

    const data = res.data

    return data
    // error 


}