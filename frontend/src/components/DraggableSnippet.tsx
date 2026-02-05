import { type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  id: string;
  children: ReactNode;
};

export default function DraggableSnippet({ id, children }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}


// import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
// import { Card } from "@mui/material";

// export default function DraggableSnippet({ snippet, children }: any) {
//   const { attributes, listeners, setNodeRef, transform } =
//     useDraggable({ id: snippet._id });

//   const style = {
//     transform: CSS.Translate.toString(transform),
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
//       <Card sx={{ mb: 2 }}>{children}</Card>
//     </div>
//   );
// }
