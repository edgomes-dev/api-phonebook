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
        return res.status(500).json({ message: "Contato com esse número já existe" });
    }

    try {
        await ContactModel.create(contact);

        return res.status(201).json({ message: "Contato inserido no sistema com sucesso" })
    } catch (error) {
        return res.status(500).json({ error: error });
    }
});

router.get('/', async (req, res) =>
{
    try {
        const contatcs = await ContactModel.find({ deleted_at: null  });

        return res.status(200).json(contatcs);
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

router.get('/:group', async (req, res) => 
{
    const group = req.params.group;

    if(group === "job") {
        try 
        {
            const contactGroup = await ContactModel.find({ group: "job", deleted_at: null });
            const mixed = await ContactModel.find({ group: "mixed", deleted_at: null });

            return res.status(200).json([contactGroup, mixed]);
        } catch (error) {
            return res.status(500).json({ error: error });
    }
    } else if (group === "folks") {
        try 
        {
            const contactGroup = await ContactModel.find({ group: "folks", deleted_at: null })
            const mixed = await ContactModel.find({ group: "mixed", deleted_at: null })

            return res.status(200).json([contactGroup, mixed]);
        } catch (error) {
            return res.status(500).json({ error: error }); 
        }
    } else if (group === "favorite") {
        try 
        {
            const contactFav = await ContactModel.find({ isFavorite: true, deleted_at: null })

            return res.status(200).json(contactFav);
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    } else if (group === "bin") {
        try 
        {
            const contactBin = await ContactModel.find({ deleted_at: { $ne: null } })

            return res.status(200).json(contactBin);
        } catch (error) {
            return res.status(500).json({ error: error });
        }
    } else if (group === "history") {
        try
        {
            const contactHistory = await ContactModel.find()

            return res.status(200).json(contactHistory);
        } catch (error)
        {
            console.log(error)
        }
    }
    
    return res.status(500).json({ error: "Esta rota não existe" })
})

router.put('/', async (req, res) => 
{
    const 
    {
        _id,
        name,
        telephone,
        group,
        isFavorite,
        deleted_at
    }: IContact = req.body;

    const contact: IContact = 
    {        
        _id,
        name,
        telephone,
        group,
        isFavorite,
        deleted_at
    }

    try{
        const contactUpdated = await ContactModel.updateOne({ _id: _id }, contact);

        return res.status(200).json({ message: "Contato deleteado com sucesso" })
    }catch (err) {
        res.status(500).json({ error: error });
    }
})

export default router;