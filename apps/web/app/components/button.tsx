

interface ButtonProps {
    title : string
    onclick :  (event: React.MouseEvent<HTMLButtonElement>) => void;
}


export const ButtonComponent = ({title, onclick} : ButtonProps) => {
    return (
        <button onClick={onclick} >{title}</button>
    )
}