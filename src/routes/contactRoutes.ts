import { Router, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { ContactModel } from '../db/contactModel'
import { IContact } from '../type/contactType'

const router = Router();

router.post('/', [
    body("name").isString(),
    body("telephone").isNumeric().isLength({ min: 5 }),
    body("group").isString().isLength({ min: 3 })
], async (req: Request, res: Response) => 
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({ message: "Dado preenchido incorreto" })
    }

    const 
    {
        name,
        telephone,
        email,
        group,
        isFavorite,
        company,
        office,
        description
    }: IContact = req.body;

    const contact: IContact = 
    {
        name,
        telephone,
        email,
        group,
        isFavorite,
        company,
        office,
        description
    }

    const telephoneExists = await ContactModel.exists({ telephone: telephone });
    if(telephoneExists)
    {
        res.status(500).json({ message: "Contato com esse número já existe" });
        return
    }

    try {
        await ContactModel.create(contact);

        res.status(201).json({ message: "Contato inserido no sistema com sucesso" })
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.get('/', async (req, res) =>
{
    try {
        const contatcs = await ContactModel.find();
        res.status(200).json(contatcs);
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:group', async (req, res) => 
{
    const group = req.params.group;

    if(group === "job")
    {
        try {
            const contactGroup = await ContactModel.find({ group: "job" })
            const mixed = await ContactModel.find({ group: "mixed" });

            res.status(200).json([contactGroup, mixed]);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    if(group === "folks")
    {
        try {
            const contactGroup = await ContactModel.find({ group: "folks" })
            const mixed = await ContactModel.find({ group: "mixed" })

            res.status(200).json([contactGroup, mixed]);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    if(group === "favorite")
    {
        try {
            const contactFav = await ContactModel.find({ isFavorite: true })

            res.status(200).json(contactFav);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }

    if(group === "delete")
    {
        try {
            const contactDelete = await ContactModel.find({ isDelete: true })

            res.status(200).json(contactDelete);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
})

export default router;