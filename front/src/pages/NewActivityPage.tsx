import { ActivityForm, Activity } from "../components/ActivityForm";

export const NewActivityPage = () => {
  const handleCreate = (data: Activity) => {
    console.log("Crear actividad:", data);
    // Aquí iría el POST a tu backend
  };

  return <ActivityForm onSubmit={handleCreate} />;
};
