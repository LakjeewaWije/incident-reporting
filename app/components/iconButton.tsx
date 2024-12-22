import FontAwesome from "@expo/vector-icons/FontAwesome"
import { TouchableOpacity } from "react-native"

const IconButton = ({ icon, size, color, onPress, style }: any) => {
    return <TouchableOpacity style={style}
        onPress={() => onPress()}>
        <FontAwesome size={size} name={icon} color={color} />
    </TouchableOpacity>
}

export default IconButton;