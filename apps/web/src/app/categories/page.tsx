import {posts} from "@repo/db/data";
import {categories} from "@/functions/categories";
import {toUrlPath} from "@repo/utils/url";



export default async function CategoriesPage() {

    const categoryList = await categories(posts);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Categories</h1>
            <ul className="flex flex-col gap-2">
                {categoryList.map((category) => (
                    <li key={category.name}>
                        <a href={`/category/${toUrlPath(category.name)}`}>{category.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
