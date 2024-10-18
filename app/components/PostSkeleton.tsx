import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

const PostSkeleton = () => (
  <Card className="overflow-hidden bg-[#FAFAF8] shadow-sm hover:shadow-md transition-shadow duration-200">
    <CardHeader className="flex flex-row items-center justify-between bg-[#F1F0EA] p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="w-8 h-8 rounded-full" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </CardContent>
    <CardFooter className="flex justify-between bg-[#F1F0EA] p-2">
      <Skeleton className="w-16 h-8 rounded" />
      <Skeleton className="w-16 h-8 rounded" />
      <Skeleton className="w-16 h-8 rounded" />
    </CardFooter>
  </Card>
);

export default PostSkeleton;
