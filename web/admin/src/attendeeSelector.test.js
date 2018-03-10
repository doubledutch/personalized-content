/*
 * Copyright 2018 DoubleDutch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
