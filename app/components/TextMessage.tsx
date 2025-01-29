interface TextMessageProps {
  text: string;
}

export default function TextMessage({ text }: TextMessageProps) {
  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <p className="text-gray-800">{text}</p>
    </div>
  )
}
