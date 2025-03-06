import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export interface ProfileImageProps {
  id?: string;
  userId?: string;
  className?: string;
  size?: string;
}

function ProfileImage({ id, userId, className, size }: ProfileImageProps) {
    // The ProfileImage component is used to display the profile image of a user.
    const basePath = process.env.REACT_APP_API_URL;
    const [imagePath, setImagePath] = useState<string>('/assets/images/tickhawk.png')
    const [classString, setClassString] = useState<string>('')
    const auth = useAuth()
    
    // Check if the id is provided, if not, use the id of the authenticated user.
    useEffect(() => {
        let identifier = userId || id;
        if (!identifier) {
            identifier = auth?.user?.id
        }
        const path = `${basePath}/user/profile/image/${identifier}`
        setImagePath(path);

        if (className) {
            setClassString(className)
        } else if (size === 'sm') {
            setClassString('w-8 h-8 rounded-full')
        } else {
            setClassString('w-6 h-6 mr-2 rounded-full')
        }
    }, [id, userId, auth, basePath, className, size])

    return (
    <img
      className={classString}
      src={imagePath}
      alt='Profile'
    />
  )
}

export default ProfileImage
