--insert the Tony Stark record to the account table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--Update Tony Stark record to be Admin type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--Delete Tony Stark record
DELETE FROM public.account
WHERE account_id = 1;
--Update GM Hummer Description
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'the small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--Use an inner join to find items that fit in the Sport category
SELECT inv.inv_make,
    inv.inv_model,
    cls.classification_name
FROM public.inventory inv
    INNER JOIN public.classification cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';
--Update image and thumbnail paths in the inventory table
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');