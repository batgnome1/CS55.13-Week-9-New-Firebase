import Restaurant from "@/src/components/Module.jsx";
import { Suspense } from "react";
import { getRestaurantById } from "@/src/lib/firebase/firestore.js";
import {
  getAuthenticatedAppForUser,
  getAuthenticatedAppForUser as getUser,
} from "@/src/lib/firebase/serverApp.js";
import ReviewsList, {
  ReviewsListSkeleton,
} from "@/src/components/Reviews/ReviewsList";
import {
  GeminiSummary,
  GeminiSummarySkeleton,
} from "@/src/components/Reviews/ReviewSummary";
import { getFirestore } from "firebase/firestore";

export default async function Home(props) {
  // This is a server component, we can access URL
  // parameters via Next.js and download the data
  // we need for this page
  const params = await props.params;
  const { currentUser } = await getUser();
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const module = await getModuleById(
    getFirestore(firebaseServerApp),
    params.id
  );

  return (
    <main className="main__module">
      <Module
        id={params.id}
        initialModule={module}
        initialUserId={currentUser?.uid || ""}
      >
        <Suspense fallback={<GeminiSummarySkeleton />}>
          <GeminiSummary restaurantId={params.id} />
        </Suspense>
      </Module>
      <Suspense
        fallback={<ReviewsListSkeleton numReviews={module.numRatings} />}
      >
        <ReviewsList moduleId={params.id} userId={currentUser?.uid || ""} />
      </Suspense>
    </main>
  );
}
