import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

function ProfileImage ({ id, className }: { id?: string; className?: string }) {
    const basePath = process.env.REACT_APP_API_URL;
    const [imagePath, setImagePath] = useState<string>('/assets/tickhawk.png')
    const [classString, setClassString] = useState<string>('')
    const auth = useAuth()
    
    useEffect(() => {
        let identifier = id;
        if (!id ) {
            identifier = auth?.user?.id
        }
        const path = `${basePath}/user/profile/image/${identifier}`
        setImagePath(path);

        if (className) {
            setClassString(className)
        }else{
            setClassString('w-6 h-6 mr-2 rounded-full')
        }
    }, [id, auth])
    return (
    <img
      className={classString}
      src={imagePath}
      alt='Profile image'
    />
  )
}

export default ProfileImage
