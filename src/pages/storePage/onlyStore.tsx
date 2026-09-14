import { useGetStore } from "@/API/store";
import Padding from "@/components/layout/padding";
import ContentStore from "@/features/storePage/onlyStore";
import { Route } from "@/routes/(protected)/stores/store/$id";

const OnlyStore = () => {
  const { id } = Route.useParams();
  const { data } = useGetStore(id);
  return (
    <Padding>
      {data && (
        <ContentStore
          type="stores"
          id={id}
          name={data.name}
          image={data.image}
          email={data.email}
          phone={data.phone}
          website={data.website}
          categories={data.categories}
          country={data.address.country}
          state={data.address.state}
          city={data.address.city}
          street={data.address.street}
          zipCode={data.address.zipCode}
          rating={data.rating}
          sunday={data.openingHours.sunday}
          monday={data.openingHours.monday}
          tuesday={data.openingHours.tuesday}
          wednesday={data.openingHours.wednesday}
          thursday={data.openingHours.thursday}
          friday={data.openingHours.friday}
          saturday={data.openingHours.saturday}
        />
      )}
    </Padding>
  );
};

export default OnlyStore;
