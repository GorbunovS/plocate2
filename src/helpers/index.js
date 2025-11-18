export function getAnimalTypeLabel (type) {
    const labels = {
        dog: 'собаку',
        cat: 'кошку',
        other: 'петомца',
    }
    return labels[type] || type
}

export function getAnimalTypeIcon(type) { 
    const labels = {
        dog: 'las la-dog',
        cat: 'las la-cat',
        other: 'las la-paw',
    }
    return labels[type] || type
}

export function  getSearchDuration (dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return `${days}д ${hours % 24}ч`
    }
    return `${hours}ч`
}


// export { getAnimalTypeLabel, getAnimalTypeIcon }