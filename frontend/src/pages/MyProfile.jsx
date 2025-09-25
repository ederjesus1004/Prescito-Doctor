import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Loader2,
    Upload,
    User,
    Phone,
    MapPin,
    Calendar,
    UserCircle2,
} from "lucide-react";

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token, backendUrl, userData, setUserData, loadUserProfileData } =
        useContext(AppContext);

    const updateUserProfileData = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", userData.name);
            formData.append("phone", userData.phone);
            formData.append("address", JSON.stringify(userData.address));
            formData.append("gender", userData.gender);
            formData.append("dob", userData.dob);

            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.post(
                `${backendUrl}/api/user/update-profile`,
                formData,
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al actualizar tu perfil");
        } finally {
            setIsLoading(false);
        }
    };

    if (!userData) return null;

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg">
            <div className="space-y-10">
                <div className="flex flex-col items-center space-y-4">
                    <label
                        htmlFor="image"
                        className="relative group cursor-pointer"
                    >
                        <div className="w-40 h-40 rounded-full overflow-hidden transition-all duration-300 ease-in-out group-hover:opacity-90 border-2 border-gray-200 shadow-md">
                            <img
                                className="w-full h-full object-cover"
                                src={
                                    image
                                        ? URL.createObjectURL(image)
                                        : userData.image
                                }
                                alt="Perfil"
                            />
                        </div>
                        {isEdit && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Upload className="w-10 h-10 text-white" />
                            </div>
                        )}
                        {isEdit && (
                            <input
                                onChange={(e) =>
                                    setImage(e.target.files?.[0] || null)
                                }
                                type="file"
                                id="image"
                                className="hidden"
                                accept="image/*"
                            />
                        )}
                    </label>
                    {isEdit ? (
                        <input
                            className="bg-white text-3xl font-medium text-center w-full max-w-xs px-3 py-2 border-b-2 border-gray-300 focus:outline-none focus:border-primary transition duration-300"
                            type="text"
                            onChange={(e) =>
                                setUserData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            value={userData.name}
                            placeholder="Tu nombre"
                        />
                    ) : (
                        <h2 className="font-medium text-3xl text-gray-800">
                            {userData.name}
                        </h2>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <h3 className="text-2xl font-medium text-gray-700 border-b-2 border-gray-200 pb-2">
                            Información de Contacto
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <User className="w-6 h-6 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Correo electrónico
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        {userData.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Phone className="w-6 h-6 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Teléfono
                                    </p>
                                    {isEdit ? (
                                        <input
                                            className="w-full px-3 py-2 text-lg border-b-2 border-gray-300 focus:outline-none focus:border-primary transition duration-300"
                                            type="tel"
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    phone: e.target.value,
                                                }))
                                            }
                                            value={userData.phone}
                                            placeholder="Tu número de teléfono"
                                        />
                                    ) : (
                                        <p className="text-lg text-gray-700">
                                            {userData.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start space-x-4">
                                <MapPin className="w-6 h-6 text-gray-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Dirección
                                    </p>
                                    {isEdit ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full px-3 py-2 text-lg border-b-2 border-gray-300 focus:outline-none focus:border-primary transition duration-300"
                                                type="text"
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            line1: e.target
                                                                .value,
                                                        },
                                                    }))
                                                }
                                                value={userData.address.line1}
                                                placeholder="Línea de dirección 1"
                                            />
                                            <input
                                                className="w-full px-3 py-2 text-lg border-b-2 border-gray-300 focus:outline-none focus:border-primary transition duration-300"
                                                type="text"
                                                onChange={(e) =>
                                                    setUserData((prev) => ({
                                                        ...prev,
                                                        address: {
                                                            ...prev.address,
                                                            line2: e.target
                                                                .value,
                                                        },
                                                    }))
                                                }
                                                value={userData.address.line2}
                                                placeholder="Línea de dirección 2"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-lg text-gray-700">
                                            {userData.address.line1}
                                            <br />
                                            {userData.address.line2}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-2xl font-medium text-gray-700 border-b-2 border-gray-200 pb-2">
                            Información Básica
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <UserCircle2 className="w-6 h-6 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Género
                                    </p>
                                    {isEdit ? (
                                        <select
                                            className="w-full px-3 py-2 text-lg border-b-2 border-gray-300 focus:outline-none focus:border-primary transition duration-300"
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    gender: e.target.value,
                                                }))
                                            }
                                            value={userData.gender}
                                        >
                                            <option value="No Seleccionado">
                                                No Seleccionado
                                            </option>
                                            <option value="Masculino">
                                                Masculino
                                            </option>
                                            <option value="Femenino">
                                                Femenino
                                            </option>
                                        </select>
                                    ) : (
                                        <p className="text-lg text-gray-700">
                                            {userData.gender}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Calendar className="w-6 h-6 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Fecha de Nacimiento
                                    </p>
                                    {isEdit ? (
                                        <input
                                            className="w-full px-3 py-2 text-lg border-b-2 border-gray-300 focus:outline-none focus:border-primary transition duration-300"
                                            type="date"
                                            onChange={(e) =>
                                                setUserData((prev) => ({
                                                    ...prev,
                                                    dob: e.target.value,
                                                }))
                                            }
                                            value={userData.dob}
                                        />
                                    ) : (
                                        <p className="text-lg text-gray-700">
                                            {userData.dob}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-8">
                    {isEdit ? (
                        <button
                            type="button"
                            onClick={updateUserProfileData}
                            disabled={isLoading}
                            className="px-8 py-3 bg-primary text-white text-lg rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300 shadow-md"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-6 w-6 inline-block" />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar Información"
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsEdit(true)}
                            className="px-8 py-3 border-2 border-primary text-primary text-lg rounded-full hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors duration-300 shadow-md"
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
