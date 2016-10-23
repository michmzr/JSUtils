/**
 * Created by Michal Mazur on 2016-05-11.
 */

/**
 * Return elementary info about html element
 *
 * @param elem
 * @returns String
 */
function jqueryElemToString(elem)
{
    if($(elem))
    {
        return (elem.id ? "#" + $(elem).prop("id") + "" : "") + " name='" + $(elem).prop("name") +"'";
    }

    return "";
}