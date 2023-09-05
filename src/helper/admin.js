import axios from "../utils/axios";

export async function checkPrivilege(token){
    let user = await axios.get('/api/admin/user',{
        headers:{
            Authorization: 'Bearer '+token,
        },
        withCredentials:true
    })
    return {
        user_id: user.data.user_id,
        adminName: user.data.adminName,
        adminLevel: user.data.adminLevel
    }
}