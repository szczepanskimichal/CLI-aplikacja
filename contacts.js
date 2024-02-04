//contacts.js
// const fs = require("node:fs/promises");
// const path = require("path");

import { promises as fs } from "fs";
import path from "path";

//Importowanie funkcji generującej unikalne identyfikatory:
const getNanoid = async () => {
  const module = await import("nanoid");
  return module.nanoid;
};
//Definiowanie ścieżki do pliku z danymi kontaktów:

const contactsPath = "./db/contacts.json";

// Funkcja listContacts odczytująca dane kontaktów z pliku JSON:
const listContacts = async () => {
  //Funkcja jest oznaczona jako asynchroniczna (async), co oznacza, że może korzystać z operacji asynchronicznych, takich jak odczyt pliku, bez blokowania wykonania programu.

  //try: Oto blok, w którym próbujemy wykonać operacje podatne na błędy.
  // await fs.readFile(contactsPath, "utf-8"): Oczekuje na odczyt pliku kontaktów. Wczytane dane są zakodowane w formacie UTF-8.
  // JSON.parse(data): Parsuje wczytane dane z formatu JSON do postaci tablicy lub obiektu, w zależności od struktury pliku JSON.
  try {
    console.log("Reading contacts from file...");
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    console.log("Contacts loaded successfully:", contacts);
    return contacts; // Zwracanie danych kontaktów:
  } catch (error) {
    // Obsługa błędów:
    console.error("Error while loading contacts:", error.message);
  }
};

// Funkcja getContactById zwracająca kontakt o określonym identyfikatorze:
const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact) {
      throw new Error(`Contact with id=${contactId} not found`);
    }
    return contact;
  } catch (error) {
    console.log(error.message);
  }
};

// //Funkcja removeContact usuwająca kontakt o określonym identyfikatorze:
// const removeContact = async (contactId) => {
//   try {
//     const contacts = await listContacts();
//     const index = contacts.findIndex((item) => item.id === contactId);
//     if (index === -1) {
//       throw new Error(`Contact with id=${contactId} not found`);
//     }
//     const newContacts = contacts.filter((item) => item.id !== contactId);
//     await fs.writeFile(contactsPath, JSON.stringify(newContacts));
//     return contacts[index];
//   } catch (error) {
//     console.log(error.message);
//   }
// };
const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === contactId);

    if (index === -1) {
      throw new Error(`Contact with id=${contactId} not found`);
    }

    const [removedContact] = contacts.splice(index, 1); // Usuń kontakt i zapisz usunięty
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return removedContact;
  } catch (error) {
    throw new Error(error.message); // Rzuć błąd dalej
  }
};

//Funkcja addContact dodająca nowy kontakt do zbioru:
const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts(); // Pobierz aktualną listę kontaktów
    const nanoid = await getNanoid(); // Wygeneruj unikalny identyfikator

    const newContact = { id: nanoid(), name, email, phone }; // Stwórz nowy kontakt
    contacts.push(newContact); // Dodaj nowy kontakt do listy
    // await fs.writeFile(contactsPath, JSON.stringify(contacts));
    // Zapisz zaktualizowaną listę kontaktów do pliku z formatowaniem JSON
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact; // Zwróć nowo dodany kontakt
  } catch (error) {
    console.log("Error while adding contact:", error.message);
    // Rzuć błąd ponownie, aby umożliwić obsługę go na wyższym poziomie
    throw error;
  }
};

const formatContactForTable = (contact) => {
  const { id, name, email, phone } = contact;
  return { id, name, email, phone };
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  formatContactForTable,
};
