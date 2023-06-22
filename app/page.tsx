import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "./actions/getListings";

import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";

interface HomeProps {
  searchParams: IListingsParams;
}

export const dynamic = "force-dynamic";

const Home = async ({ searchParams }: HomeProps) => {
  // const listings = [
  //   {
  //     id: "6493b36691be4bb731825e45",
  //     title: "property3",
  //     description: "property3 description",
  //     imageSrc:
  //       "https://res.cloudinary.com/db0ybllx7/image/upload/v1687401294/ugi5rhye6qnagvdby0ab.jpg",
  //     createdAt: "2023-06-22T02:35:18.662Z",
  //     category: "Windmills",
  //     roomCount: 3,
  //     bathroomCount: 2,
  //     guestCount: 4,
  //     locationValue: "AF",
  //     userId: "6479807e11d99818756c8b14",
  //     price: 300,
  //   },
  // ];
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {listings.map((listing) => {
            return (
              <ListingCard
                currentUser={currentUser}
                key={listing.id}
                data={listing}
              />
            );
          })}
        </div>
      </Container>
    </ClientOnly>
  );
};

export default Home;
