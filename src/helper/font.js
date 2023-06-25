import { Poppins } from "next/font/google";

const PoppinsFont = Poppins({
    subsets:['latin'],
    weight:['100','200','300','400','500','600','700','800','900']
})

export const Font = {
    PoppinsFont,
}