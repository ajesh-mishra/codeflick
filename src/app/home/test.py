class Solution:
    def findNumbers(self, nums: list[int]) -> int:
      result: int = 0

      for num in nums:
        num_digits: int = len(str(num))
        if num_digits % 2 == 0:
          result += 1

      return result

  if __name__ == "__main__":
    input: list[int] = [12, 2290, 2437, 3]
    s = Solution()
    print(s.findNumbers(input))