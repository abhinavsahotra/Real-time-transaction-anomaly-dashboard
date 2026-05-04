
function Card({ className, ...props}: React.ComponentProps<'div'>){
  return(
    <div className={`bg-[#ffffff] text-card-foreground flex flex-col gap-6 rounded-xl border border-[#E5E5E5] shadow-md px-4 py-6 + ${className}`}
      {...props}
      />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={
        `gap-2 px-6,
        ${className}
      `}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={`leading-none font-semibold', ${className}`}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={`text-gray-200 text-sm', ${className}`}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={
        `col-start-2 row-span-2 row-start-1 self-start justify-self-end,
        ${className}`}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={`px-6', ${className}`}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={`flex items-center px-6 [.border-t]:pt-6 + ${className}`}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
