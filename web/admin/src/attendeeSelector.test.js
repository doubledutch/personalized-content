import {isAttendeeInTierOrGroup} from './AttendeeSelector'

test('isAttendeeInTierOrGroup returns false when there are no matches', () => {
  const attendee = {
    tierId: 42,
    userGroupIds: [1,2,3]
  }
  const selectedTierIds = [8,9]
  const selectedGroupIds = [10,11]
  
  const result = isAttendeeInTierOrGroup(attendee, selectedTierIds, selectedGroupIds)
  expect(result).toEqual(false)
})

test('isAttendeeInTierOrGroup returns true when a tierId matches', () => {
  const attendee = {
    tierId: 42,
    userGroupIds: [1,2,3]
  }
  const selectedTierIds = [8,42]
  const selectedGroupIds = [10,11]
  
  const result = isAttendeeInTierOrGroup(attendee, selectedTierIds, selectedGroupIds)
  expect(result).toEqual(true)
})

test('isAttendeeInTierOrGroup returns true when a groupId matches', () => {
  const attendee = {
    tierId: 42,
    userGroupIds: [1,2,3]
  }
  const selectedTierIds = [8,9]
  const selectedGroupIds = [2,10,11]
  
  const result = isAttendeeInTierOrGroup(attendee, selectedTierIds, selectedGroupIds)
  expect(result).toEqual(true)
})

test('isAttendeeInTierOrGroup returns true when a groupId and tierId matches', () => {
  const attendee = {
    tierId: 42,
    userGroupIds: [1,2,3]
  }
  const selectedTierIds = [8,9,42]
  const selectedGroupIds = [2,10,11]
  
  const result = isAttendeeInTierOrGroup(attendee, selectedTierIds, selectedGroupIds)
  expect(result).toEqual(true)
})
