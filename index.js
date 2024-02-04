import { Command } from "commander";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  formatContactForTable,
} from "./contacts.js";

const program = new Command();

program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const options = program.opts();

const invokeAction = async () => {
  const { action, id, name, email, phone } = options;

  console.log("Arguments:", { action, id, name, email, phone });
  console.log("Invoking action:", action);

  if (action === "list") {
    const contacts = await listContacts();
    const formattedContacts = contacts.map(formatContactForTable);
    console.table(formattedContacts);
  } else if (action === "get") {
    const contactById = await getContactById(id);
    const formattedContact = formatContactForTable(contactById);
    console.table([formattedContact]);
  } else if (action === "add") {
    const newContact = await addContact(name, email, phone);
    const formattedNewContact = formatContactForTable(newContact);
    console.table([formattedNewContact]);
  } else if (action === "remove") {
    const contactToRemove = await removeContact(id);
    const formattedContactToRemove = formatContactForTable(contactToRemove);
    console.table([formattedContactToRemove]);
  } else {
    console.warn("\x1B[31m Unknown action type!");
  }
};

invokeAction();
