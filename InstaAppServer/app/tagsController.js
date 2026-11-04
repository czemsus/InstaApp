import { tags, tagsObjects } from "./Model.js";
export default class TagsController {
    constructor() {
        this.tags = tagsObjects
        this.rawTags = tags
        this.message = ''
    }


    findTag(index) {
        return this.tags.find((a) => a.id === index)
    }

    getTags() {
        return this.tags
    }

    getRawTags() {
        return this.rawTags
    }

    addtag(tagName, tagPopularity) {

        if (!this.tags.some(a => a.name == tagName)) {
            this.tags.push({ 'id': this.tags.length, 'name': tagName, 'popularity': tagPopularity })
            this.rawTags.push(tagName)
            this.message = 'tag został pomyslnie dodany'
        } else {
            this.message = 'taki tag juz istnieje'
        }

    }
}