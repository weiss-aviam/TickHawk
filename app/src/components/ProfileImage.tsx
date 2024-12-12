import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";


function ProfileImage ({ id, className }: { id?: string; className?: string }) {
    // The ProfileImage component is used to display the profile image of a user.
    const basePath = process.env.REACT_APP_API_URL;
    const [imagePath, setImagePath] = useState<string>('/assets/tickhawk.png')
    const [classString, setClassString] = useState<string>('')
    const auth = useAuth()
    
    // Check if the id is provided, if not, use the id of the authenticated user.
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
    }, [id, auth, basePath, className])
    return (
    <img
      className={classString}
      src={imagePath}
      alt='Profile'
    />
  )
}

export default ProfileImage
